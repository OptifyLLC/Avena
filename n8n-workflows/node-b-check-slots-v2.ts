import { workflow, node, trigger, ifElse, expr, newCredential } from '@n8n/workflow-sdk';

const webhookTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook',
    parameters: { httpMethod: 'POST', path: 'check-slots-v2', responseMode: 'responseNode', options: {} },
    position: [0, 0]
  },
  output: [{ body: { message: { toolCallList: [{ id: 'call_1', function: { arguments: { target_date: '2026-04-20' } } }], call: { assistantId: 'asst_abc' } } } }]
});

const parseRequest = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const msg = $json.body?.message || {};
const toolCall = msg.toolCallList?.[0] || msg.toolCalls?.[0];
const toolCallId = toolCall?.id || 'unknown';
const assistantId = msg.call?.assistantId || msg.assistant?.id || '';
const rawArgs = toolCall?.function?.arguments;
let args = {};
if (typeof rawArgs === 'string') { try { args = JSON.parse(rawArgs); } catch(e) {} }
else if (rawArgs && typeof rawArgs === 'object') { args = rawArgs; }
return [{ json: { toolCallId, assistantId, target_date: args.target_date || null } }];`
    },
    position: [220, 0]
  },
  output: [{ toolCallId: 'call_1', assistantId: 'asst_abc', target_date: '2026-04-20' }]
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

const buildContext = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Context',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const parsed = $('Parse Request').item.json;
const tenants = $input.all().map(i => i.json).filter(t => t && t.id);
const tenant = tenants[0];
if (!tenant) return [{ json: { error: true, toolCallId: parsed.toolCallId, result: 'This voice assistant is not linked to a workspace. Please contact support.' } }];
const SLOT_MINUTES = 30;
const now = new Date();
let searchStart;
if (parsed.target_date) {
  const targetStart = new Date(parsed.target_date + 'T09:00:00');
  searchStart = targetStart <= now ? new Date(Math.ceil(now.getTime() / (30*60*1000)) * (30*60*1000)) : targetStart;
} else {
  searchStart = new Date(Math.ceil(now.getTime() / (30*60*1000)) * (30*60*1000));
}
const searchEnd = new Date(searchStart.getTime() + 7 * 24 * 60 * 60 * 1000);
return [{ json: { error: false, toolCallId: parsed.toolCallId, tenantId: tenant.id, timezone: tenant.timezone || 'America/New_York', slotMinutes: SLOT_MINUTES, target_date: parsed.target_date, searchStart: searchStart.toISOString(), searchEnd: searchEnd.toISOString(), searchStartMs: searchStart.getTime() } }];`
    },
    position: [660, 0]
  },
  output: [{ error: false, toolCallId: 'call_1', tenantId: 'tenant-uuid', timezone: 'America/New_York', slotMinutes: 30, target_date: '2026-04-20', searchStart: '2026-04-20T13:00:00.000Z', searchEnd: '2026-04-27T13:00:00.000Z', searchStartMs: 1745154000000 }]
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
    position: [1100, 100]
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
      jsCode: `const ctx = $('Build Context').item.json;
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
  output: [{ error: false, toolCallId: 'call_1', tenantId: 'tenant-uuid', timezone: 'America/New_York', slotMinutes: 30, target_date: '2026-04-20', searchStart: '2026-04-20T13:00:00.000Z', searchEnd: '2026-04-27T13:00:00.000Z', searchStartMs: 1745154000000, hasCalendar: true, accessToken: 'ya29...' }]
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

const getCalendarEvents = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Get Calendar Events',
    parameters: {
      method: 'GET',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      authentication: 'none',
      sendQuery: true, specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: 'timeMin', value: expr('{{ $json.searchStart }}') },
          { name: 'timeMax', value: expr('{{ $json.searchEnd }}') },
          { name: 'singleEvents', value: 'true' },
          { name: 'orderBy', value: 'startTime' },
          { name: 'maxResults', value: '250' }
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

const findNextFreeSlots = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Find Next Free Slots',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('Build Context').item.json;
const TIMEZONE = ctx.timezone || 'America/New_York';
const SLOT_MS = (ctx.slotMinutes || 30) * 60 * 1000;
const STEP_MS = 30 * 60 * 1000;
const inputs = $input.all();
let eventItems = [];
for (const it of inputs) {
  const j = it.json || {};
  if (Array.isArray(j.items)) eventItems = eventItems.concat(j.items);
  else if (j.id && (j.start || j.end)) eventItems.push(j);
}
const busySlots = eventItems.map(e => {
  const s = e.start?.dateTime || (e.start?.date ? e.start.date + 'T00:00:00' : null);
  const en = e.end?.dateTime || (e.end?.date ? e.end.date + 'T23:59:59' : null);
  return { start: s ? new Date(s).getTime() : NaN, end: en ? new Date(en).getTime() : NaN };
}).filter(e => !isNaN(e.start) && !isNaN(e.end));
function getLocalMinutes(ts) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ts));
  const obj = {}; parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; });
  return Number(obj.hour) * 60 + Number(obj.minute);
}
function getDayOfWeek(ts) { return new Date(ts).toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long' }); }
function formatSlot(ts) { return new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ts)); }
const slots = [];
let cursor = ctx.searchStartMs;
const maxTime = ctx.searchStartMs + 7 * 24 * 60 * 60 * 1000;
while (slots.length < 3 && cursor < maxTime) {
  const slotEnd = cursor + SLOT_MS;
  const startMin = getLocalMinutes(cursor);
  const endMin = getLocalMinutes(slotEnd);
  const day = getDayOfWeek(cursor);
  if (day !== 'Saturday' && day !== 'Sunday' && startMin >= 540 && endMin <= 1020) {
    if (!busySlots.some(b => cursor < b.end && slotEnd > b.start)) {
      slots.push({ label: formatSlot(cursor), ts: cursor });
    }
  }
  cursor += STEP_MS;
}
const result = slots.length === 0 ? 'I could not find any available slots in the next 7 days. I can have someone reach out to you instead.' : 'Here are the next available slots: ' + slots.map((s, i) => (i+1) + '. ' + s.label).join(', ') + '. Which one works best for you?';
return [{ json: { toolCallId: ctx.toolCallId, result, slots } }];`
    },
    position: [1980, -200]
  },
  output: [{ toolCallId: 'call_1', result: 'Here are the next available slots...', slots: [] }]
});

const respondToVapi = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond to Vapi',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ results: [{ toolCallId: $json.toolCallId, result: $json.result }] }) }}'), options: {} },
    position: [2200, -200]
  },
  output: [{}]
});

const calendarFlow = getCalendarEvents.to(findNextFreeSlots.to(respondToVapi));
const calendarGate = calendarConnected.onFalse(notConnectedResponse).onTrue(calendarFlow);
const mainFlow = getGoogleTokens.to(resolveAccessToken.to(calendarGate));

export default workflow('yrF6vqClZ0kE2mVh', 'Node B — Get Available Slots copy')
  .add(webhookTrigger)
  .to(parseRequest)
  .to(getTenant)
  .to(buildContext)
  .to(hasError.onTrue(errorResponse).onFalse(mainFlow));
