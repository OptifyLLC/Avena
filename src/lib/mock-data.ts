export type CallIntent =
  | "Appointment booked"
  | "Q&A · business hours"
  | "Transferred to human"
  | "Hot lead · tagged"
  | "Voicemail · no intent"
  | "Qualified · follow-up";

export type CallTone = "emerald" | "amber" | "zinc" | "rose";

export type CallRecord = {
  id: string;
  caller: string;
  name: string;
  duration: string;
  intent: CallIntent;
  tone: CallTone;
  startedAt: string;
  score: "Hot" | "Warm" | "Cold" | null;
  summary: string;
};

export type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled";

export type Appointment = {
  id: string;
  when: string;
  time: string;
  date: string;
  name: string;
  phone: string;
  service: string;
  status: AppointmentStatus;
};

export type LeadScore = "Hot" | "Warm" | "Cold";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  score: LeadScore;
  note: string;
  lastCallAt: string;
  source: "Inbound call" | "Callback" | "Referral";
};

export type IntegrationKey =
  | "google-calendar"
  | "google-sheets"
  | "google-drive"
  | "twilio"
  | "stripe"
  | "hubspot"
  | "slack"
  | "zapier";

export type Integration = {
  key: IntegrationKey;
  name: string;
  category: "Calendar" | "Data" | "Telephony" | "Billing" | "CRM" | "Comms" | "Automation";
  description: string;
  connected: boolean;
  account?: string;
};

const iso = (daysAgo: number, hour = 0, minute = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const seedCalls: CallRecord[] = [
  {
    id: "call_001",
    caller: "+1 (415) 555-0139",
    name: "Morgan Reyes",
    duration: "1:42",
    intent: "Appointment booked",
    tone: "emerald",
    startedAt: iso(0, 9, 12),
    score: "Hot",
    summary:
      "Pre-approved buyer asking about 3BR listings. Booked a tour for Friday 3:00 PM.",
  },
  {
    id: "call_002",
    caller: "+1 (347) 555-0183",
    name: "—",
    duration: "0:48",
    intent: "Q&A · business hours",
    tone: "zinc",
    startedAt: iso(0, 9, 2),
    score: null,
    summary: "Caller asked about weekend hours. Answered; no booking needed.",
  },
  {
    id: "call_003",
    caller: "+1 (646) 555-0104",
    name: "Priya Shah",
    duration: "3:11",
    intent: "Transferred to human",
    tone: "amber",
    startedAt: iso(0, 8, 14),
    score: "Warm",
    summary:
      "Caller wanted to speak to an agent about an active offer. Transferred to front desk.",
  },
  {
    id: "call_004",
    caller: "+1 (212) 555-0187",
    name: "Daniel Okafor",
    duration: "2:07",
    intent: "Hot lead · tagged",
    tone: "emerald",
    startedAt: iso(0, 7, 40),
    score: "Hot",
    summary:
      "Budget and timeline confirmed. Ready to tour — recommend agent follow-up within 24h.",
  },
  {
    id: "call_005",
    caller: "+1 (718) 555-0166",
    name: "Lena Park",
    duration: "0:33",
    intent: "Voicemail · no intent",
    tone: "zinc",
    startedAt: iso(0, 6, 21),
    score: "Cold",
    summary: "Caller hung up before stating reason. No voicemail left.",
  },
  {
    id: "call_006",
    caller: "+1 (305) 555-0122",
    name: "Rafael Cruz",
    duration: "4:28",
    intent: "Appointment booked",
    tone: "emerald",
    startedAt: iso(1, 14, 50),
    score: "Warm",
    summary:
      "Comparing listings. Booked a listing walkthrough for Tuesday 10:15 AM.",
  },
  {
    id: "call_007",
    caller: "+1 (512) 555-0191",
    name: "Avery Lin",
    duration: "1:05",
    intent: "Qualified · follow-up",
    tone: "emerald",
    startedAt: iso(1, 11, 30),
    score: "Warm",
    summary:
      "First-time buyer, needs agent intro. Scheduled discovery for next Friday.",
  },
  {
    id: "call_008",
    caller: "+1 (206) 555-0155",
    name: "James Park",
    duration: "2:44",
    intent: "Appointment booked",
    tone: "emerald",
    startedAt: iso(2, 10, 5),
    score: "Hot",
    summary: "Seller consultation booked for Thursday 1:00 PM.",
  },
  {
    id: "call_009",
    caller: "+1 (602) 555-0143",
    name: "Sofia Rivera",
    duration: "1:18",
    intent: "Q&A · business hours",
    tone: "zinc",
    startedAt: iso(2, 15, 22),
    score: null,
    summary: "Asked about documents needed for closing. Sent checklist via SMS.",
  },
  {
    id: "call_010",
    caller: "+1 (415) 555-0121",
    name: "Ethan Wu",
    duration: "3:52",
    intent: "Hot lead · tagged",
    tone: "emerald",
    startedAt: iso(3, 9, 40),
    score: "Hot",
    summary: "Relocation, 45-day timeline. High intent — follow up today.",
  },
];

export const seedAppointments: Appointment[] = [
  {
    id: "appt_001",
    when: "Today",
    date: iso(0, 14, 30),
    time: "2:30 PM",
    name: "Morgan Reyes",
    phone: "+1 (415) 555-0139",
    service: "Property showing · 1402 Oak St.",
    status: "Confirmed",
  },
  {
    id: "appt_002",
    when: "Today",
    date: iso(0, 16, 0),
    time: "4:00 PM",
    name: "Daniel Okafor",
    phone: "+1 (212) 555-0187",
    service: "Buyer consult · 30 min",
    status: "Confirmed",
  },
  {
    id: "appt_003",
    when: "Tomorrow",
    date: iso(-1, 10, 15),
    time: "10:15 AM",
    name: "Rafael Cruz",
    phone: "+1 (305) 555-0122",
    service: "Listing walkthrough",
    status: "Confirmed",
  },
  {
    id: "appt_004",
    when: "Tomorrow",
    date: iso(-1, 13, 0),
    time: "1:00 PM",
    name: "Priya Shah",
    phone: "+1 (646) 555-0104",
    service: "Follow-up · post-offer",
    status: "Pending",
  },
  {
    id: "appt_005",
    when: "Fri, Apr 24",
    date: iso(-5, 11, 30),
    time: "11:30 AM",
    name: "Avery Lin",
    phone: "+1 (512) 555-0191",
    service: "New inquiry · discovery",
    status: "Confirmed",
  },
  {
    id: "appt_006",
    when: "Mon, Apr 27",
    date: iso(-8, 9, 0),
    time: "9:00 AM",
    name: "Ethan Wu",
    phone: "+1 (415) 555-0121",
    service: "Relocation consult",
    status: "Pending",
  },
];

export const seedLeads: Lead[] = [
  {
    id: "lead_001",
    name: "Daniel Okafor",
    phone: "+1 (212) 555-0187",
    email: "daniel.okafor@example.com",
    company: "Okafor Partners",
    score: "Hot",
    note: "Budget confirmed · ready to tour",
    lastCallAt: iso(0, 7, 40),
    source: "Inbound call",
  },
  {
    id: "lead_002",
    name: "Morgan Reyes",
    phone: "+1 (415) 555-0139",
    email: "morgan.reyes@example.com",
    score: "Hot",
    note: "Pre-approved · 3BR target",
    lastCallAt: iso(0, 9, 12),
    source: "Inbound call",
  },
  {
    id: "lead_003",
    name: "Avery Lin",
    phone: "+1 (503) 555-0114",
    email: "avery.lin@example.com",
    company: "Lin Co.",
    score: "Warm",
    note: "First-time buyer · needs agent intro",
    lastCallAt: iso(1, 11, 30),
    source: "Inbound call",
  },
  {
    id: "lead_004",
    name: "Rafael Cruz",
    phone: "+1 (305) 555-0122",
    score: "Warm",
    note: "Comparing listings · timeline 30d",
    lastCallAt: iso(1, 14, 50),
    source: "Callback",
  },
  {
    id: "lead_005",
    name: "Lena Park",
    phone: "+1 (718) 555-0166",
    score: "Cold",
    note: "Research stage · no follow-up yet",
    lastCallAt: iso(2, 13, 0),
    source: "Inbound call",
  },
  {
    id: "lead_006",
    name: "Ethan Wu",
    phone: "+1 (415) 555-0121",
    email: "ethan.wu@example.com",
    score: "Hot",
    note: "Relocation · 45-day timeline",
    lastCallAt: iso(3, 9, 40),
    source: "Referral",
  },
  {
    id: "lead_007",
    name: "James Park",
    phone: "+1 (206) 555-0155",
    company: "Park Group",
    score: "Warm",
    note: "Seller consultation scheduled",
    lastCallAt: iso(2, 10, 5),
    source: "Inbound call",
  },
];

export const seedIntegrations: Integration[] = [
  {
    key: "google-calendar",
    name: "Google Calendar",
    category: "Calendar",
    description:
      "Reads live availability and writes confirmed bookings back to the team calendar.",
    connected: true,
    account: "team@cedarridge.co",
  },
  {
    key: "google-sheets",
    name: "Google Sheets",
    category: "Data",
    description:
      "One row per call — caller, intent, lead score, transcript link.",
    connected: true,
    account: "Avena Call Log · team sheet",
  },
  {
    key: "google-drive",
    name: "Google Drive",
    category: "Data",
    description: "Stores the call recording and transcript for every conversation.",
    connected: true,
    account: "team@cedarridge.co · /Avena",
  },
  {
    key: "twilio",
    name: "Twilio",
    category: "Telephony",
    description: "Inbound number, SMS confirmations, and warm-transfer routing.",
    connected: true,
    account: "+1 (415) 555-0117",
  },
  {
    key: "stripe",
    name: "Stripe",
    category: "Billing",
    description: "Handles subscription billing, usage overages, and invoicing.",
    connected: false,
  },
  {
    key: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Syncs qualified leads and call summaries into HubSpot contacts.",
    connected: false,
  },
  {
    key: "slack",
    name: "Slack",
    category: "Comms",
    description: "Pings a channel whenever Avena books a new appointment or tags a hot lead.",
    connected: false,
  },
  {
    key: "zapier",
    name: "Zapier",
    category: "Automation",
    description: "Trigger any downstream workflow when Avena updates the call log.",
    connected: false,
  },
];
