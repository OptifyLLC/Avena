import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const webhookTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook',
    parameters: { httpMethod: 'POST', path: 'book-appointment-v2', responseMode: 'responseNode', options: {} },
    position: [0, 0]
  },
  output: [{ body: { message: { toolCallList: [{ id: 'call_1', function: { arguments: { requested_date: 'tomorrow', requested_time: '2pm', caller_name: 'John', caller_phone: '+1555', caller_email: '' } } }], call: { assistantId: 'asst_abc' } } } }]
});

const parseBookingRequest = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Booking Request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const msg = $json.body?.message || {};
const toolCall = msg.toolCallList?.[0] || msg.toolCalls?.[0];
if (!toolCall) return [{ json: { error: true, toolCallId: 'unknown', assistantId: '', result: 'No tool call found in webhook payload.' } }];
const toolCallId = toolCall.id || 'unknown';
const assistantId = msg.call?.assistantId || msg.assistant?.id || '';
const vapiCallId = msg.call?.id || '';
const rawArgs = toolCall.function?.arguments;
let args;
if (typeof rawArgs === 'string') {
  try { args = JSON.parse(rawArgs); } catch(e) { return [{ json: { error: true, toolCallId, assistantId, result: 'Could not parse booking details. Please try again.' } }]; }
} else if (rawArgs && typeof rawArgs === 'object') args = rawArgs;
else return [{ json: { error: true, toolCallId, assistantId, result: 'No booking details found. Please provide a date and time.' } }];
const requestedDate = args.requested_date;
const requestedTime = args.requested_time;
const callerName = args.caller_name || '';
const callerEmail = args.caller_email || '';
const callerPhone = args.caller_phone || msg.customer?.number || msg.call?.customer?.number || '';
if (!requestedDate || !requestedTime) return [{ json: { error: true, toolCallId, assistantId, result: 'I need both a date and time to book. Could you please provide those?' } }];
function parseTimeTo24h(raw) {
  const s = String(raw).trim().toLowerCase();
  const m12 = s.match(/^(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)$/);
  if (m12) { let h = Number(m12[1]); const m = Number(m12[2] || 0); if (m12[3] === 'pm' && h !== 12) h += 12; if (m12[3] === 'am' && h === 12) h = 0; return { hour: h, minute: m }; }
  const m24 = s.match(/^(\\d{1,2}):(\\d{2})$/);
  if (m24) return { hour: Number(m24[1]), minute: Number(m24[2]) };
  return null;
}
function parseDate(raw) {
  const s = String(raw).trim().toLowerCase();
  const today = new Date();
  if (s === 'today') return { year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate() };
  if (s === 'tomorrow') { const d = new Date(today); d.setDate(d.getDate()+1); return { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate() }; }
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate() };
  return null;
}
const time = parseTimeTo24h(requestedTime);
const date = parseDate(requestedDate);
if (!time) return [{ json: { error: true, toolCallId, assistantId, result: 'Sorry, I could not understand the time. Could you repeat it?' } }];
if (!date) return [{ json: { error: true, toolCallId, assistantId, result: 'Sorry, I could not understand the date. Could you repeat it?' } }];
return [{ json: { error: false, toolCallId, assistantId, vapiCallId, caller_name: callerName, caller_phone: callerPhone, caller_email: callerEmail, requested_date: String(requestedDate), requested_time: String(requestedTime), date_parts: date, time_parts: time } }];`
    },
    position: [220, 0]
  },
  output: [{ error: false, toolCallId: 'call_1', assistantId: 'asst_abc', vapiCallId: 'vcall_1', caller_name: 'John', caller_phone: '+1555', caller_email: '', requested_date: 'tomorrow', requested_time: '2pm', date_parts: { year: 2026, month: 4, day: 20 }, time_parts: { hour: 14, minute: 0 } }]
});

const getTenant = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Get Tenant',
    parameters: {
      resource: 'row', operation: 'getAll', tableId: 'tenants', returnAll: true,
      filterType: 'manual', matchType: 'allFilters',
      filters: { conditions: [{ keyName: 'vapi_assistant_id', condition: 'eq', keyValue: expr('{{ $json.assistantId }}') }] }
    },
    executeOnce: true, alwaysOutputData: true,
    credentials: { supabaseApi: newCredential('Supabase - Optify') },
    position: [440, 0]
  },
  output: [{ id: 'tenant-uuid', name: 'Acme', timezone: 'America/New_York', vapi_assistant_id: 'asst_abc' }]
});

const buildBooking = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Booking',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const parsed = $('Parse Booking Request').item.json;
if (parsed.error) return [{ json: parsed }];
const tenants = $input.all().map(i => i.json).filter(t => t && t.id);
const tenant = tenants[0];
if (!tenant) return [{ json: { ...parsed, error: true, result: 'This voice assistant is not linked to a workspace. Please contact support.' } }];
const tz = tenant.timezone || 'America/New_York';
const SLOT_MINUTES = 30;
const startLocal = DateTime.fromObject({ year: parsed.date_parts.year, month: parsed.date_parts.month, day: parsed.date_parts.day, hour: parsed.time_parts.hour, minute: parsed.time_parts.minute }, { zone: tz });
if (!startLocal.isValid) return [{ json: { ...parsed, error: true, result: 'Could not build a valid appointment time. Please try again.' } }];
const endLocal = startLocal.plus({ minutes: SLOT_MINUTES });
const searchEndLocal = startLocal.plus({ days: 7 });
return [{ json: { error: false, toolCallId: parsed.toolCallId, tenantId: tenant.id, timezone: tz, slotMinutes: SLOT_MINUTES, vapiCallId: parsed.vapiCallId, caller_name: parsed.caller_name, caller_phone: parsed.caller_phone, caller_email: parsed.caller_email, requested_date: parsed.requested_date, requested_time: parsed.requested_time, start_iso: startLocal.toISO(), end_iso: endLocal.toISO(), search_end_iso: searchEndLocal.toISO(), start_ms: startLocal.toMillis() } }];`
    },
    position: [660, 0]
  },
  output: [{ error: false, toolCallId: 'call_1', tenantId: 'tenant-uuid', timezone: 'America/New_York', slotMinutes: 30, vapiCallId: 'vcall_1', caller_name: 'John', caller_phone: '+1555', caller_email: '', requested_date: 'tomorrow', requested_time: '2pm', start_iso: '2026-04-20T14:00:00.000-04:00', end_iso: '2026-04-20T14:30:00.000-04:00', search_end_iso: '2026-04-27T14:00:00.000-04:00', start_ms: 1745172000000 }]
});

const hasError = ifElse({
  version: 2.3,
  config: {
    name: 'Has Error?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 3 },
        conditions: [{ id: 'err1', leftValue: expr('{{ $json.error }}'), operator: { type: 'boolean', operation: 'true', singleValue: true }, rightValue: '' }],
        combinator: 'and'
      },
      options: {}
    },
    position: [880, 0]
  }
});

const errorResponse = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Error Response',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ results: [{ toolCallId: $json.toolCallId, result: $json.result }] }) }}'), options: {} },
    position: [1100, 200]
  },
  output: [{}]
});

const getGoogleTokens = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Get Google Tokens',
    parameters: {
      resource: 'row', operation: 'getAll', tableId: 'google_tokens', returnAll: true,
      filterType: 'manual', matchType: 'allFilters',
      filters: { conditions: [{ keyName: 'tenant_id', condition: 'eq', keyValue: expr('{{ $json.tenantId }}') }] }
    },
    executeOnce: true, alwaysOutputData: true,
    credentials: { supabaseApi: newCredential('Supabase - Optify') },
    position: [1100, -100]
  },
  output: [{ tenant_id: 'tenant-uuid', access_token: 'ya29...', refresh_token: '1//...', scope: 'openid email calendar.events', expires_at: '2030-01-01T00:00:00Z' }]
});

const resolveAccessToken = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Resolve Access Token',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Build Booking').item.json;
const rows = $input.all().map(i => i.json).filter(r => r && r.tenant_id && r.access_token);
const row = rows[0] || null;
if (!row) return [{ json: { ...ctx, hasCalendar: false, result: 'This business has not connected their calendar yet. I will pass your request to the team.' } }];
const now = Date.now();
const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;
const needsRefresh = !expiresAt || (expiresAt - now) < 5 * 60 * 1000;
if (!needsRefresh) return [{ json: { ...ctx, hasCalendar: true, accessToken: row.access_token } }];
if (!row.refresh_token) return [{ json: { ...ctx, hasCalendar: false, result: 'Calendar token expired and cannot be refreshed. Please ask the business to reconnect.' } }];
const clientId = $env.GOOGLE_CLIENT_ID;
const clientSecret = $env.GOOGLE_CLIENT_SECRET;
const supabaseUrl = $env.SUPABASE_URL;
const serviceRole = $env.SUPABASE_SERVICE_ROLE_KEY;
if (!clientId || !clientSecret || !supabaseUrl || !serviceRole) return [{ json: { ...ctx, hasCalendar: false, result: 'Server is missing Google or Supabase configuration. Please contact support.' } }];
try {
  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: row.refresh_token, grant_type: 'refresh_token' }).toString()
  });
  const tj = await tokenResp.json();
  if (!tokenResp.ok || !tj.access_token) return [{ json: { ...ctx, hasCalendar: false, result: 'Calendar token refresh failed. Please ask the business to reconnect.' } }];
  const newExpiresAt = new Date(Date.now() + (tj.expires_in || 3600) * 1000).toISOString();
  await fetch(supabaseUrl + '/rest/v1/google_tokens?tenant_id=eq.' + encodeURIComponent(ctx.tenantId), {
    method: 'PATCH',
    headers: { apikey: serviceRole, authorization: 'Bearer ' + serviceRole, 'content-type': 'application/json', prefer: 'return=minimal' },
    body: JSON.stringify({ access_token: tj.access_token, expires_at: newExpiresAt, updated_at: new Date().toISOString() })
  });
  return [{ json: { ...ctx, hasCalendar: true, accessToken: tj.access_token } }];
} catch (e) {
  return [{ json: { ...ctx, hasCalendar: false, result: 'Calendar token refresh error. Please ask the business to reconnect.' } }];
}`
    },
    position: [1320, -100]
  },
  output: [{ error: false, toolCallId: 'call_1', tenantId: 'tenant-uuid', timezone: 'America/New_York', slotMinutes: 30, vapiCallId: 'vcall_1', caller_name: 'John', caller_phone: '+1555', caller_email: '', requested_date: 'tomorrow', requested_time: '2pm', start_iso: '2026-04-20T14:00:00.000-04:00', end_iso: '2026-04-20T14:30:00.000-04:00', search_end_iso: '2026-04-27T14:00:00.000-04:00', start_ms: 1745172000000, hasCalendar: true, accessToken: 'ya29...' }]
});

const calendarConnected = ifElse({
  version: 2.3,
  config: {
    name: 'Calendar Connected?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 3 },
        conditions: [{ id: 'conn1', leftValue: expr('{{ $json.hasCalendar }}'), operator: { type: 'boolean', operation: 'true', singleValue: true }, rightValue: '' }],
        combinator: 'and'
      },
      options: {}
    },
    position: [1540, -100]
  }
});

const notConnectedResponse = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Calendar Not Connected Response',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ results: [{ toolCallId: $json.toolCallId, result: $json.result }] }) }}'), options: {} },
    position: [1760, 0]
  },
  output: [{}]
});

const getEventsInSlot = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Get Events in Slot',
    parameters: {
      method: 'GET',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      authentication: 'none',
      sendQuery: true, specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: 'timeMin', value: expr('{{ $json.start_iso }}') },
          { name: 'timeMax', value: expr('{{ $json.end_iso }}') },
          { name: 'singleEvents', value: 'true' },
          { name: 'maxResults', value: '20' }
        ]
      },
      sendHeaders: true, specifyHeaders: 'keypair',
      headerParameters: { parameters: [{ name: 'Authorization', value: expr('Bearer {{ $json.accessToken }}') }] },
      options: {}
    },
    position: [1760, -200]
  },
  output: [{ kind: 'calendar#events', items: [] }]
});

const checkIfSlotFree = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check If Slot Free',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Build Booking').item.json;
const accessToken = $('Resolve Access Token').item.json.accessToken;
const inputs = $input.all();
let eventItems = [];
for (const it of inputs) {
  const j = it.json || {};
  if (Array.isArray(j.items)) eventItems = eventItems.concat(j.items);
  else if (j.id && (j.start || j.end)) eventItems.push(j);
}
const isFree = eventItems.length === 0;
return [{ json: { ...ctx, accessToken, available: isFree } }];`
    },
    position: [1980, -200]
  },
  output: [{ error: false, toolCallId: 'call_1', tenantId: 'tenant-uuid', timezone: 'America/New_York', slotMinutes: 30, accessToken: 'ya29...', available: true, caller_name: 'John', caller_phone: '+1555', caller_email: '', start_iso: '2026-04-20T14:00:00.000-04:00', end_iso: '2026-04-20T14:30:00.000-04:00' }]
});

const isSlotAvailable = ifElse({
  version: 2.3,
  config: {
    name: 'Is Slot Available?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 3 },
        conditions: [{ id: 'avail1', leftValue: expr('{{ $json.available }}'), operator: { type: 'boolean', operation: 'true', singleValue: true }, rightValue: '' }],
        combinator: 'and'
      },
      options: {}
    },
    position: [2200, -200]
  }
});

const createCalendarEvent = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Create Calendar Event',
    parameters: {
      method: 'POST',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      authentication: 'none',
      sendHeaders: true, specifyHeaders: 'keypair',
      headerParameters: { parameters: [{ name: 'Authorization', value: expr('Bearer {{ $json.accessToken }}') }] },
      sendBody: true, contentType: 'json', specifyBody: 'json',
      jsonBody: expr('{{ JSON.stringify({ summary: "Appointment - " + ($json.caller_name || "caller"), description: "Booked via AI Voice Agent.\\nCaller: " + ($json.caller_name || "") + ($json.caller_phone ? "\\nPhone: " + $json.caller_phone : "") + ($json.caller_email ? "\\nEmail: " + $json.caller_email : ""), start: { dateTime: $json.start_iso, timeZone: $json.timezone }, end: { dateTime: $json.end_iso, timeZone: $json.timezone } }) }}'),
      options: {}
    },
    position: [2420, -300]
  },
  output: [{ id: 'evt_abc', htmlLink: 'https://calendar.google.com/...', summary: 'Appointment - John' }]
});

const insertAppointment = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Insert Appointment',
    parameters: {
      resource: 'row', operation: 'create', tableId: 'appointments', dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'tenant_id', fieldValue: expr("{{ $('Build Booking').item.json.tenantId }}") },
          { fieldId: 'google_event_id', fieldValue: expr('{{ $json.id }}') },
          { fieldId: 'title', fieldValue: expr("{{ 'Appointment - ' + ($('Build Booking').item.json.caller_name || 'caller') }}") },
          { fieldId: 'attendee_name', fieldValue: expr("{{ $('Build Booking').item.json.caller_name || '' }}") },
          { fieldId: 'attendee_phone', fieldValue: expr("{{ $('Build Booking').item.json.caller_phone || '' }}") },
          { fieldId: 'attendee_email', fieldValue: expr("{{ $('Build Booking').item.json.caller_email || '' }}") },
          { fieldId: 'scheduled_for', fieldValue: expr("{{ $('Build Booking').item.json.start_iso }}") },
          { fieldId: 'duration_minutes', fieldValue: '30' },
          { fieldId: 'status', fieldValue: 'confirmed' }
        ]
      }
    },
    credentials: { supabaseApi: newCredential('Supabase - Optify') },
    position: [2640, -300]
  },
  output: [{ id: 'appt_1', tenant_id: 'tenant-uuid', title: 'Appointment - John', scheduled_for: '2026-04-20T14:00:00.000-04:00' }]
});

const returnConfirmed = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Return — Booking Confirmed',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const booking = $('Build Booking').item.json;
const calEvent = $('Create Calendar Event').item.json;
return [{ json: { status: 'confirmed', toolCallId: booking.toolCallId, result: 'Perfect! I have booked your appointment for ' + booking.requested_date + ' at ' + booking.requested_time + '. You will receive a confirmation shortly, ' + booking.caller_name + '.', caller_phone: booking.caller_phone, caller_name: booking.caller_name, htmlLink: calEvent.htmlLink || '' } }];`
    },
    position: [2860, -300]
  },
  output: [{ status: 'confirmed', toolCallId: 'call_1', result: 'Perfect! ...', caller_phone: '+1555', caller_name: 'John', htmlLink: 'https://calendar.google.com/...' }]
});

const respondConfirmed = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond — Confirmed',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ results: [{ toolCallId: $json.toolCallId, result: $json.result }] }) }}'), options: {} },
    position: [3080, -300]
  },
  output: [{}]
});

const getUpcomingEvents = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Get Upcoming Events',
    parameters: {
      method: 'GET',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      authentication: 'none',
      sendQuery: true, specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: 'timeMin', value: expr('{{ $json.start_iso }}') },
          { name: 'timeMax', value: expr('{{ $json.search_end_iso }}') },
          { name: 'singleEvents', value: 'true' },
          { name: 'orderBy', value: 'startTime' },
          { name: 'maxResults', value: '250' }
        ]
      },
      sendHeaders: true, specifyHeaders: 'keypair',
      headerParameters: { parameters: [{ name: 'Authorization', value: expr('Bearer {{ $json.accessToken }}') }] },
      options: {}
    },
    position: [2420, -100]
  },
  output: [{ kind: 'calendar#events', items: [] }]
});

const findThreeFreeSlots = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Find 3 Free Slots',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Build Booking').item.json;
const TIMEZONE = ctx.timezone || 'America/New_York';
const SLOT_MS = (ctx.slotMinutes || 30) * 60 * 1000;
const STEP_MS = 30 * 60 * 1000;
const callerName = ctx.caller_name;
const requestedStart = ctx.start_ms;
const maxTime = requestedStart + 7 * 24 * 60 * 60 * 1000;
const inputs = $input.all();
let eventItems = [];
for (const it of inputs) {
  const j = it.json || {};
  if (Array.isArray(j.items)) eventItems = eventItems.concat(j.items);
  else if (j.id && (j.start || j.end)) eventItems.push(j);
}
const busy = eventItems.map(e => {
  const s = e.start?.dateTime || (e.start?.date ? e.start.date + 'T00:00:00' : null);
  const en = e.end?.dateTime || (e.end?.date ? e.end.date + 'T23:59:59' : null);
  return { start: s ? new Date(s).getTime() : NaN, end: en ? new Date(en).getTime() : NaN };
}).filter(e => !isNaN(e.start) && !isNaN(e.end));
function getLocalMinutes(ts) { const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ts)); const obj = {}; parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; }); return Number(obj.hour) * 60 + Number(obj.minute); }
function getDayOfWeek(ts) { return new Date(ts).toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long' }); }
function formatSlot(ts) { return new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ts)); }
const slots = [];
let cursor = requestedStart + STEP_MS;
while (slots.length < 3 && cursor < maxTime) {
  const slotEnd = cursor + SLOT_MS;
  const startMin = getLocalMinutes(cursor);
  const endMin = getLocalMinutes(slotEnd);
  const day = getDayOfWeek(cursor);
  if (day !== 'Saturday' && day !== 'Sunday' && startMin >= 540 && endMin <= 1020) {
    if (!busy.some(b => cursor < b.end && slotEnd > b.start)) {
      slots.push({ iso: new Date(cursor).toISOString(), label: formatSlot(cursor) });
    }
  }
  cursor += STEP_MS;
}
const resultText = slots.length > 0 ? 'Sorry ' + callerName + ', that slot is already taken. Here are the next 3 available times: ' + slots.map((s, i) => (i+1) + '. ' + s.label).join(', ') + '. Which one works best for you?' : 'Sorry ' + callerName + ', that time is taken and I could not find availability in the next 7 days. Someone will follow up with you shortly.';
return [{ json: { toolCallId: ctx.toolCallId, result: resultText, slots } }];`
    },
    position: [2640, -100]
  },
  output: [{ toolCallId: 'call_1', result: 'Sorry John...', slots: [] }]
});

const returnAlternatives = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Return — Suggest Alternatives',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `return [{ json: { status: 'alternatives', toolCallId: $json.toolCallId, result: $json.result, slots: $json.slots || [] } }];`
    },
    position: [2860, -100]
  },
  output: [{ status: 'alternatives', toolCallId: 'call_1', result: 'Sorry John...', slots: [] }]
});

const respondAlternatives = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond — Alternatives',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ results: [{ toolCallId: $json.toolCallId, result: $json.result }] }) }}'), options: {} },
    position: [3080, -100]
  },
  output: [{}]
});

const confirmedBranch = createCalendarEvent.to(insertAppointment.to(returnConfirmed.to(respondConfirmed)));
const alternativesBranch = getUpcomingEvents.to(findThreeFreeSlots.to(returnAlternatives.to(respondAlternatives)));
const slotFlow = getEventsInSlot.to(checkIfSlotFree.to(isSlotAvailable.onTrue(confirmedBranch).onFalse(alternativesBranch)));
const calendarGate = calendarConnected.onFalse(notConnectedResponse).onTrue(slotFlow);
const mainFlow = getGoogleTokens.to(resolveAccessToken.to(calendarGate));

export default workflow('SPh5o7bezQaJuQr9', 'Node A — Appointment Booking copy')
  .add(webhookTrigger)
  .to(parseBookingRequest)
  .to(getTenant)
  .to(buildBooking)
  .to(hasError.onTrue(errorResponse).onFalse(mainFlow));
