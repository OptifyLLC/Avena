import type { Metadata } from "next";
import {
  Callout,
  LegalLayout,
  type LegalSection,
  LI,
  P,
  Strong,
  UL,
} from "@/components/landing/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Operavo",
  description:
    "How Operavo collects, uses, and protects information when you use our real-time inbound voice agent — including SMS opt-in and opt-out.",
};

const sections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <P>
          This Privacy Policy explains how{" "}
          <Strong>Operavo</Strong> (&ldquo;Operavo&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects, uses, shares, and safeguards personal
          information when you use{" "}
          <Strong>Operavo</Strong> — our real-time voice agent that answers,
          qualifies, books, and hands off inbound calls — together with our
          dashboard, websites, and related services (the &ldquo;Service&rdquo;).
        </P>
        <P>
          Operavo is sold to and configured by businesses (our{" "}
          <Strong>Customers</Strong>) who route their inbound phone calls
          through us. When you, as an end caller, dial a Customer using
          Operavo, the Customer is the &ldquo;controller&rdquo; of your personal
          information and Operavo acts as a &ldquo;processor&rdquo; on their
          behalf. For our own marketing site and dashboard accounts, Operavo is
          the controller.
        </P>
        <Callout title="In one paragraph">
          We collect call audio, transcripts, caller phone numbers, and the
          information you give Operavo during a call (such as your name, email,
          and the time you want to book) so we can run the call, send a
          confirmation, and write the result back to your Customer&rsquo;s
          calendar and CRM. We do not sell personal information.
        </Callout>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    body: (
      <>
        <P>
          Depending on how you interact with Operavo, we collect the following
          categories of information:
        </P>
        <UL>
          <LI label="Account data">
            Name, work email, company, password hash, role, and approval status
            you submit when you request access at{" "}
            <Strong>/signup</Strong> or sign in at <Strong>/login</Strong>.
          </LI>
          <LI label="Call audio and transcripts">
            Inbound call recordings, real-time speech-to-text transcripts, and
            structured turn-by-turn logs of what was said by the caller and by
            Operavo.
          </LI>
          <LI label="Caller details">
            Phone number, caller ID where available, and any details the caller
            shares on the call (typically full name, email, address,
            appointment preferences, and reason for calling).
          </LI>
          <LI label="Booking and CRM data">
            Appointment time, calendar invite metadata, lead score
            (Hot / Warm / Cold), AI-generated summary, recommended next action,
            and any CRM or spreadsheet rows we write on your behalf.
          </LI>
          <LI label="SMS confirmations">
            Phone numbers and message content sent through our telephony
            partners when Operavo texts a booking confirmation.
          </LI>
          <LI label="Integration data">
            Read and write tokens for the third-party tools you connect — for
            example Google Calendar, Google Drive, Google Sheets, and SMS
            providers — limited to the scopes required to deliver the feature
            you enabled.
          </LI>
          <LI label="Usage and device data">
            IP address, browser, operating system, pages visited, referring
            URL, and product interaction events for the dashboard. Used to
            keep the Service secure and to debug problems.
          </LI>
          <LI label="Cookies">
            Strictly necessary cookies for authentication (session token,
            theme), and optional analytics cookies if you accept them. See{" "}
            <Strong>Cookies &amp; tracking</Strong> below.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "call-recording",
    title: "Call recording & consent",
    body: (
      <>
        <P>
          Operavo answers and records inbound phone calls on behalf of our
          Customers. Many U.S. states (including California, Florida,
          Pennsylvania, Massachusetts, and Washington) and several countries
          require <Strong>all parties to consent</Strong> before a call is
          recorded.
        </P>
        <UL>
          <LI label="Disclosure">
            Every Operavo workspace is configured to play a short recording
            disclosure at the start of the call (for example: &ldquo;This call
            may be recorded for quality and scheduling.&rdquo;). Customers are
            responsible for keeping that disclosure enabled in their region.
          </LI>
          <LI label="Caller controls">
            A caller can ask Operavo to stop the recording or to be transferred
            to a human at any time. Operavo will not store audio if a caller
            opts out before consent is captured.
          </LI>
          <LI label="Retention">
            Recordings are retained for the period configured by the Customer
            (default <Strong>90 days</Strong>) and then permanently deleted.
          </LI>
        </UL>
        <Callout tone="amber" title="Two-party consent">
          If your business operates in a two-party consent jurisdiction, you
          must keep the recording disclosure enabled. We will not disable it
          on your behalf.
        </Callout>
      </>
    ),
  },
  {
    id: "sms-messaging",
    title: "SMS messaging & consent",
    body: (
      <>
        <P>
          Operavo sends SMS text messages from a verified toll-free or 10DLC
          number on behalf of our Customers. The program is{" "}
          <Strong>transactional only</Strong> — appointment confirmations
          and reminders for bookings made through the Operavo voice agent.
          We do not send marketing messages, drip sequences, or third-party
          content, and we never sell, rent, or share phone numbers with
          third parties for their marketing.
        </P>
        <Callout tone="emerald" title="Verbal opt-in script">
          <P>
            Opt-in is captured <Strong>verbally</Strong> during the recorded
            call, before any SMS is sent. Operavo says:
          </P>
          <P>
            &ldquo;I can text you a confirmation of your appointment with{" "}
            <Strong>[Business Name]</Strong> at the number you called from.
            You&rsquo;ll get one confirmation now and a reminder before your
            visit. Message and data rates may apply, and you can reply{" "}
            <Strong>STOP</Strong> at any time to opt out or{" "}
            <Strong>HELP</Strong> for help. Is it okay if I text you?&rdquo;
          </P>
          <P>
            We proceed only after the caller answers &ldquo;yes&rdquo; (or
            an equivalent affirmative). If the caller declines, no SMS is
            sent and the booking is confirmed by voice only. Each consent is
            stored with the call recording, transcript, timestamp, and the
            caller&rsquo;s phone number.
          </P>
        </Callout>
        <P>What we send and how often:</P>
        <UL>
          <LI label="Confirmation">
            Sent immediately after the caller verbally opts in and the
            booking lands on the Customer&rsquo;s calendar.
          </LI>
          <LI label="Reminder">
            Up to one reminder before the appointment, when the Customer has
            reminders enabled.
          </LI>
          <LI label="Reschedule or cancellation">
            Sent if the appointment time changes through Operavo.
          </LI>
          <LI label="Frequency">
            Typically <Strong>1 to 3 messages per booking</Strong>. No
            recurring marketing campaigns.
          </LI>
        </UL>
        <P>Sample messages:</P>
        <UL>
          <LI label="Confirmation">
            &ldquo;Hi [Name], your appointment with [Business Name] is
            confirmed for [Date] at [Time]. Reply STOP to opt out, HELP for
            help. Msg &amp; data rates may apply.&rdquo;
          </LI>
          <LI label="Reminder">
            &ldquo;Reminder from [Business Name]: your appointment is
            tomorrow at [Time]. Reply STOP to opt out, HELP for help.&rdquo;
          </LI>
        </UL>
        <P>Opt-out and help keywords:</P>
        <UL>
          <LI label="STOP">
            Reply <Strong>STOP</Strong>, <Strong>STOPALL</Strong>,{" "}
            <Strong>UNSUBSCRIBE</Strong>, <Strong>CANCEL</Strong>,{" "}
            <Strong>END</Strong>, or <Strong>QUIT</Strong> to any message.
            We send a single confirmation and remove your number
            immediately. Replying STOP does not cancel the appointment —
            call the business directly to reschedule.
          </LI>
          <LI label="HELP">
            Reply <Strong>HELP</Strong> or <Strong>INFO</Strong> for sender
            identification and our contact email
            (<Strong>info@operavo.ai</Strong>).
          </LI>
          <LI label="Costs">
            Operavo does not charge for these messages.{" "}
            <Strong>Message and data rates may apply</Strong> from your
            mobile carrier.
          </LI>
          <LI label="Carriers">
            All major U.S. carriers are supported. Carriers are not liable
            for delayed or undelivered messages.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use information",
    body: (
      <>
        <P>We use the information described above to:</P>
        <UL>
          <LI>
            Run live calls — route caller intent, check calendar availability,
            book the appointment, and trigger the SMS confirmation.
          </LI>
          <LI>
            Hand off to a human agent and pass a short spoken brief when the
            caller asks for a person or the conversation falls outside what
            Operavo should handle.
          </LI>
          <LI>
            Tag every call Hot / Warm / Cold, write a two-sentence summary,
            and recommend the next action so your team knows who to call back
            first.
          </LI>
          <LI>
            Provide and improve the Service, including debugging failed calls,
            tuning recovery prompts, and training internal speech models on
            de-identified data only.
          </LI>
          <LI>
            Keep accounts, audio, and integrations secure — detect abuse,
            prevent fraud, and respond to incidents.
          </LI>
          <LI>
            Send transactional messages (workspace approval, billing, security
            alerts) and, only with your consent, product updates and release
            notes.
          </LI>
          <LI>Comply with legal obligations and enforce our Terms.</LI>
        </UL>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases (EEA & UK)",
    body: (
      <>
        <P>
          If you are in the European Economic Area, the United Kingdom, or
          Switzerland, we rely on the following legal bases under the GDPR /
          UK GDPR:
        </P>
        <UL>
          <LI label="Contract">
            To provide the Service to a Customer or to you as the dashboard
            user.
          </LI>
          <LI label="Legitimate interests">
            To keep the Service secure, prevent abuse, improve product
            quality, and operate our business — balanced against your rights.
          </LI>
          <LI label="Consent">
            For optional analytics cookies, marketing emails, and any
            recording in jurisdictions that require it.
          </LI>
          <LI label="Legal obligation">
            To meet tax, accounting, and law-enforcement requirements.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    body: (
      <>
        <P>
          We do not sell or rent personal information. We share it only with:
        </P>
        <UL>
          <LI label="Customers">
            The business whose number the caller dialed receives the call
            audio, transcript, lead score, and booking record so they can
            follow up.
          </LI>
          <LI label="Sub-processors">
            Vetted vendors that run essential parts of the Service —
            telephony, speech-to-text, large-language-model inference, SMS
            delivery, calendar sync, error monitoring, cloud hosting, and
            email delivery. Each is bound by a written data-processing
            agreement and may only use the data to deliver their service.
          </LI>
          <LI label="Professional advisors">
            Lawyers, auditors, and accountants under confidentiality
            obligations.
          </LI>
          <LI label="Authorities">
            Where required by valid legal process, or to protect the rights,
            property, or safety of Operavo, our Customers, or the public.
          </LI>
          <LI label="Successors">
            In connection with a merger, acquisition, or sale of all or part
            of Operavo — under equivalent privacy commitments.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "international",
    title: "International data transfers",
    body: (
      <>
        <P>
          Operavo is operated from the United States. When personal information
          is transferred from the EEA, UK, or Switzerland to the United States
          or other countries, we rely on the European Commission&rsquo;s{" "}
          <Strong>Standard Contractual Clauses</Strong> and the UK
          International Data Transfer Addendum, together with supplementary
          measures such as encryption in transit and at rest.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <>
        <P>
          Retention defaults are listed below. Customers can shorten any of
          these in their workspace settings; we will not extend them without
          a written agreement.
        </P>
        <UL>
          <LI label="Call audio">
            90 days from the call, then permanently deleted from primary
            storage and backups within a further 30 days.
          </LI>
          <LI label="Transcripts &amp; lead records">
            13 months, so quarterly reporting works year-over-year.
          </LI>
          <LI label="SMS message bodies">
            90 days. Delivery metadata is kept for 13 months for
            deliverability auditing.
          </LI>
          <LI label="Account &amp; billing records">
            For the life of the account, plus 7 years after closure to meet
            tax and accounting obligations.
          </LI>
          <LI label="Server logs">30 days.</LI>
        </UL>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <P>
          Subject to local law, you have the right to access, correct, delete,
          export, restrict, or object to our processing of your personal
          information, and to withdraw consent where processing is based on
          consent.
        </P>
        <UL>
          <LI label="Dashboard users">
            Manage most of these directly from your account, or email{" "}
            <Strong>info@operavo.ai</Strong>.
          </LI>
          <LI label="End callers">
            Submit your request to the Customer you called (they control your
            data); we will support them in fulfilling it.
          </LI>
          <LI label="California (CCPA / CPRA)">
            You have the right to know, delete, correct, and limit the use of
            sensitive personal information. We do not sell or share personal
            information for cross-context behavioral advertising.
          </LI>
          <LI label="Appeals">
            If we decline a request, you may appeal by replying to our
            decision email — we&rsquo;ll respond within 45 days.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <P>
          We protect your data with industry-standard safeguards: TLS 1.2+ in
          transit, AES-256 at rest, scoped access tokens, least-privilege IAM,
          mandatory two-factor authentication for staff with production
          access, and continuous logging of administrative actions. No system
          is perfectly secure — please tell us about a vulnerability at{" "}
          <Strong>info@operavo.ai</Strong>.
        </P>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & tracking",
    body: (
      <>
        <P>
          We use a small set of cookies and similar technologies. You can
          manage non-essential cookies through your browser or our cookie
          banner where shown.
        </P>
        <UL>
          <LI label="Strictly necessary">
            Session, CSRF, and theme — required for the dashboard to work.
            Cannot be disabled.
          </LI>
          <LI label="Product analytics">
            Aggregated usage events to improve flows. Loaded only after you
            opt in.
          </LI>
          <LI label="No third-party advertising">
            We do not run ad-tracking pixels or share data with ad networks.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        Operavo is built for businesses and is not directed to children under
        16. We do not knowingly collect personal information from children. If
        you believe a child has provided us information, contact{" "}
        <Strong>info@operavo.ai</Strong> and we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        We update this policy as the Service evolves. Material changes will be
        announced in-product and by email to workspace admins at least 14 days
        before they take effect. The &ldquo;Last updated&rdquo; date at the
        top of this page always reflects the current version.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <P>
          For privacy questions, data-subject requests, opt-out help, or to
          designate an authorized agent, reach us at:
        </P>
        <UL>
          <LI label="Email">info@operavo.ai</LI>
          <LI label="Phone">(908) 552-1625</LI>
        </UL>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      lede="How Operavo handles the audio, transcripts, account information, and SMS confirmations that flow through the Service — written so a normal human can read it."
      lastUpdated="April 23, 2026"
      sections={sections}
    />
  );
}
