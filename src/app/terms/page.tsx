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
  title: "Terms & Conditions — Avena by Optify",
  description:
    "The agreement between you and Optify LLC for accessing and using Avena, our real-time inbound voice agent.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "The agreement",
    body: (
      <>
        <P>
          These Terms &amp; Conditions (the &ldquo;Terms&rdquo;) form a binding
          contract between you (the &ldquo;Customer&rdquo;) and{" "}
          <Strong>Optify LLC</Strong>, a Delaware limited liability company
          (&ldquo;Optify&rdquo;), and govern your access to and use of{" "}
          <Strong>Avena</Strong> — our real-time voice agent — together with
          the dashboard, websites, APIs, integrations, and documentation we
          provide (the &ldquo;Service&rdquo;).
        </P>
        <P>
          By requesting access, signing in, or using any part of the Service,
          you agree to these Terms. If you are accepting on behalf of an
          organization, you represent that you have the authority to bind that
          organization, and &ldquo;you&rdquo; includes that organization.
        </P>
        <Callout title="Plain English">
          You pay us, we run a 24/7 voice agent that answers your inbound
          calls. You stay responsible for what your callers hear, what
          recordings you store, and how you contact people Avena books for
          you.
        </Callout>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility & accounts",
    body: (
      <>
        <UL>
          <LI label="Age">
            You must be at least 18 years old and able to enter into a binding
            contract.
          </LI>
          <LI label="Approval">
            New workspaces are created in &ldquo;pending&rdquo; status until an
            Optify admin reviews and approves them. We may decline any
            request, at our sole discretion, including for unsupported
            verticals or locations.
          </LI>
          <LI label="Credentials">
            You are responsible for keeping your password and any API keys
            secret, and for all activity under your account. Tell us at{" "}
            <Strong>security@optifyllc.com</Strong> if you suspect a
            compromise.
          </LI>
          <LI label="One human per seat">
            Login credentials are personal — do not share them between
            multiple humans. Add seats instead.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "service",
    title: "What the Service does",
    body: (
      <>
        <P>The Service includes the following components:</P>
        <UL>
          <LI label="Avena voice agent">
            Answers inbound calls, qualifies the caller, books appointments
            against your live calendar, transfers to a human when asked, and
            handles safe recovery if audio degrades.
          </LI>
          <LI label="Live availability">
            Reads up to three open slots from your business hours in under two
            seconds.
          </LI>
          <LI label="SMS confirmation">
            Sends a personalised text the moment a booking confirms,
            including a one-tap calendar link.
          </LI>
          <LI label="Lead scoring & summaries">
            Tags every call Hot / Warm / Cold with a two-sentence summary and
            recommended next action.
          </LI>
          <LI label="Dashboard">
            Workspace approvals, call log, calendar view, and integrations
            management for admins and clients.
          </LI>
          <LI label="Integrations">
            Optional connections to Google Calendar, Google Drive, Google
            Sheets, and SMS providers.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "customer-responsibilities",
    title: "Your responsibilities",
    body: (
      <>
        <P>You agree that you will:</P>
        <UL>
          <LI label="Comply with law">
            Use the Service only for lawful purposes. You are responsible for
            complying with telephony, recording, marketing, and consumer
            protection laws in every jurisdiction where your callers are
            located — including the TCPA, CAN-SPAM, A2P 10DLC registration,
            two-party consent rules, GDPR, UK GDPR, and CCPA / CPRA.
          </LI>
          <LI label="Recording disclosures">
            Keep the call-recording disclosure enabled in any region that
            requires it. We will not disable it on your behalf.
          </LI>
          <LI label="Accurate calendar &amp; routing">
            Connect a calendar that reflects real availability and configure
            handoff numbers that actually answer. Avena cannot book what you
            do not expose, and cannot transfer to a number that rings out.
          </LI>
          <LI label="No prohibited verticals">
            Do not use Avena for emergency services, lethal weapons, illegal
            drugs, gambling without licence, or to impersonate humans in
            jurisdictions where AI-disclosure is mandatory unless you display
            the required disclosure.
          </LI>
          <LI label="Caller consent for outbound">
            If you enable outbound features (now or in future), you must have
            prior express written consent from each recipient. We will
            suspend any workspace generating spam complaints above industry
            thresholds.
          </LI>
          <LI label="Customer Data accuracy">
            You are the source of truth for your business hours, services,
            scripts, and FAQs. You are responsible for reviewing transcripts
            and lead scores before acting on them.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <P>You will not, and will not allow any third party to:</P>
        <UL>
          <LI>
            Reverse-engineer, decompile, or attempt to extract source code or
            model weights from the Service.
          </LI>
          <LI>
            Resell, sublicense, or expose the Service as a stand-alone
            product to third parties without a written reseller agreement
            with Optify.
          </LI>
          <LI>
            Use the Service to harass, defraud, threaten, or impersonate any
            person, or to generate content that is illegal, defamatory, or
            sexually exploitative of minors.
          </LI>
          <LI>
            Send malware, attempt to bypass rate limits, scrape audio, or
            run penetration tests without prior written authorisation from{" "}
            <Strong>security@optifyllc.com</Strong>.
          </LI>
          <LI>
            Use the Service to make automated calls to emergency numbers
            (911, 999, 112, etc.).
          </LI>
        </UL>
        <P>
          We may suspend or terminate access immediately for violations that
          create risk for callers, our infrastructure, or other Customers.
        </P>
      </>
    ),
  },
  {
    id: "billing",
    title: "Subscription, billing & taxes",
    body: (
      <>
        <UL>
          <LI label="Plans">
            Subscriptions are billed monthly or annually in advance, in U.S.
            dollars, based on the plan and seat count selected when your
            workspace is approved.
          </LI>
          <LI label="Usage charges">
            Per-minute call usage, SMS messages, and overage above plan
            allowances are billed in arrears at the rates published in your
            workspace.
          </LI>
          <LI label="Auto-renewal">
            Plans renew automatically for successive equivalent terms unless
            cancelled before the renewal date through the dashboard or by
            email to <Strong>billing@optifyllc.com</Strong>.
          </LI>
          <LI label="Late payment">
            Invoices are due on receipt. Unpaid amounts more than 15 days
            overdue accrue interest at 1.0% per month or the maximum allowed
            by law, whichever is lower.
          </LI>
          <LI label="Taxes">
            Fees are exclusive of taxes. You are responsible for sales,
            use, VAT, GST, and similar taxes, except taxes on Optify&rsquo;s
            net income.
          </LI>
          <LI label="Refunds">
            Fees are non-refundable, except where required by law or
            expressly granted in writing by Optify.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "beta",
    title: "Beta features",
    body: (
      <P>
        Features marked &ldquo;beta&rdquo;, &ldquo;preview&rdquo;, or
        &ldquo;coming soon&rdquo; — for example warm transfer with spoken
        brief — are provided{" "}
        <Strong>&ldquo;as is&rdquo; and without warranty</Strong>. They may be
        modified or removed at any time, and they are not covered by any
        service-level commitment. Use them only for evaluation.
      </P>
    ),
  },
  {
    id: "data",
    title: "Customer Data & ownership",
    body: (
      <>
        <UL>
          <LI label="Your data is yours">
            As between you and Optify, you own all rights in the call audio,
            transcripts, lead records, and any data you upload or that your
            callers provide (&ldquo;Customer Data&rdquo;).
          </LI>
          <LI label="Licence to operate">
            You grant Optify a worldwide, royalty-free licence to host,
            process, transmit, and display Customer Data solely to provide
            and improve the Service for you.
          </LI>
          <LI label="Aggregated insights">
            We may use de-identified, aggregated data (with no caller PII or
            Customer-identifying details) to improve speech recognition,
            language models, and product analytics.
          </LI>
          <LI label="Export">
            You may export your call log and lead records from the dashboard
            at any time during the term.
          </LI>
          <LI label="Deletion">
            Within 30 days after termination we will delete Customer Data,
            except where retention is required by law. See the{" "}
            <Strong>Privacy Policy</Strong> for default retention windows.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "ip",
    title: "Optify intellectual property",
    body: (
      <P>
        The Service, including the Avena agent, dashboard, models, prompts,
        documentation, and any feedback or improvements, is and remains the
        property of Optify and its licensors. We grant you a non-exclusive,
        non-transferable, revocable licence to use the Service during the
        term and for your internal business purposes only. All rights not
        expressly granted are reserved.
      </P>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <P>
        The Service interoperates with third-party platforms (such as Google
        Workspace, telephony carriers, SMS gateways, and large-language-model
        providers). Your use of those platforms is governed by their own
        terms. Optify is not responsible for their availability, accuracy, or
        actions, and we may discontinue an integration with reasonable notice
        if the third party changes its terms or pricing.
      </P>
    ),
  },
  {
    id: "ai-disclaimer",
    title: "AI-generated content",
    body: (
      <>
        <P>
          Avena uses generative AI to converse, summarise, score, and propose
          next actions. AI output can be wrong, biased, or unexpected. You
          agree to:
        </P>
        <UL>
          <LI>Review summaries and lead scores before acting on them.</LI>
          <LI>
            Not rely on Avena for medical, legal, financial, or other
            professional advice.
          </LI>
          <LI>
            Apply your own human judgement before any high-stakes follow-up
            (refunds, contract terms, medical triage, etc.).
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "warranty",
    title: "Warranty disclaimer",
    body: (
      <P>
        Except as expressly provided in a separately signed agreement, the
        Service is provided{" "}
        <Strong>
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
          warranties of any kind
        </Strong>
        , whether express, implied, or statutory, including warranties of
        merchantability, fitness for a particular purpose, title,
        non-infringement, accuracy of AI output, and uninterrupted operation.
        Some jurisdictions do not allow exclusion of implied warranties; in
        those jurisdictions our warranties are limited to the minimum extent
        permitted.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <P>
          To the maximum extent permitted by law:
        </P>
        <UL>
          <LI label="No indirect damages">
            Neither party will be liable for any indirect, incidental,
            special, consequential, exemplary, or punitive damages, or for
            lost profits, lost revenue, lost data, or business interruption,
            even if advised of the possibility.
          </LI>
          <LI label="Cap">
            Each party&rsquo;s total liability arising out of or related to
            these Terms will not exceed the fees you paid Optify for the
            Service in the twelve (12) months immediately preceding the
            claim.
          </LI>
          <LI label="Carve-outs">
            The cap does not apply to your payment obligations, your breach
            of the Acceptable Use section, or either party&rsquo;s
            indemnification obligations.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnification",
    body: (
      <P>
        You will defend, indemnify, and hold harmless Optify, its affiliates,
        and personnel from any third-party claim arising out of: (a) your or
        your callers&rsquo; misuse of the Service, (b) your violation of any
        law or these Terms, (c) Customer Data infringing the rights of a
        third party, or (d) outbound messages you send through or as a result
        of the Service. Optify will defend, indemnify, and hold you harmless
        from any third-party claim that the Service, used as permitted by
        these Terms, infringes that third party&rsquo;s intellectual property
        rights.
      </P>
    ),
  },
  {
    id: "term",
    title: "Term, suspension & termination",
    body: (
      <UL>
        <LI label="Term">
          These Terms start when you accept them and continue until your
          subscription ends.
        </LI>
        <LI label="Termination for convenience">
          Either party may terminate at the end of the current billing term
          with at least 14 days&rsquo; notice through the dashboard or
          email.
        </LI>
        <LI label="Termination for cause">
          Either party may terminate immediately if the other materially
          breaches these Terms and does not cure within 30 days of written
          notice.
        </LI>
        <LI label="Suspension">
          We may suspend access immediately for security risk, non-payment
          beyond 30 days, or violation of the Acceptable Use section.
        </LI>
        <LI label="Effect">
          On termination your right to use the Service ends, accrued fees
          remain payable, and we delete Customer Data per the Privacy
          Policy.
        </LI>
      </UL>
    ),
  },
  {
    id: "changes",
    title: "Changes to the Service or Terms",
    body: (
      <P>
        We may update the Service and these Terms as the product evolves.
        Material changes will be announced in-product and by email to
        workspace admins at least 14 days before they take effect. Continued
        use after the effective date constitutes acceptance. If you object,
        cancel before the effective date and we will refund any pre-paid,
        unused fees on a pro-rata basis.
      </P>
    ),
  },
  {
    id: "law",
    title: "Governing law & disputes",
    body: (
      <>
        <P>
          These Terms are governed by the laws of the{" "}
          <Strong>State of Delaware</Strong>, United States, without regard to
          conflict-of-laws principles. Each party submits to the exclusive
          jurisdiction of the state and federal courts located in New Castle
          County, Delaware, except that either party may seek injunctive
          relief in any court of competent jurisdiction to protect its
          intellectual property.
        </P>
        <P>
          The parties will first attempt to resolve any dispute in good faith
          for 30 days through senior representatives of each side before
          starting formal proceedings. The U.N. Convention on Contracts for
          the International Sale of Goods does not apply.
        </P>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <UL>
        <LI label="Entire agreement">
          These Terms, together with the Privacy Policy and any
          order-form-specific terms you sign, are the entire agreement
          between us about the Service.
        </LI>
        <LI label="Assignment">
          You may not assign these Terms without our prior written consent;
          we may assign them in connection with a merger, acquisition, or
          sale of substantially all our assets.
        </LI>
        <LI label="Severability">
          If any provision is unenforceable, the rest remain in effect.
        </LI>
        <LI label="No waiver">
          Failure to enforce a right is not a waiver of that right.
        </LI>
        <LI label="Force majeure">
          Neither party is liable for delay or failure caused by events
          beyond reasonable control.
        </LI>
        <LI label="Notices">
          Legal notices to Optify must be sent to{" "}
          <Strong>legal@optifyllc.com</Strong> and to our registered office
          listed below.
        </LI>
      </UL>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <UL>
        <LI label="Sales & general">hello@optifyllc.com</LI>
        <LI label="Billing">billing@optifyllc.com</LI>
        <LI label="Legal & disputes">legal@optifyllc.com</LI>
        <LI label="Security">security@optifyllc.com</LI>
        <LI label="Mail">
          Optify LLC, 1007 N Orange St, 4th Floor, Suite #1382, Wilmington,
          DE 19801, United States
        </LI>
      </UL>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Terms"
      title="Terms & Conditions"
      lede="The agreement that governs how you and Optify use Avena together — written so you can read it once, not skim it forever."
      lastUpdated="April 19, 2026"
      sections={sections}
    />
  );
}
