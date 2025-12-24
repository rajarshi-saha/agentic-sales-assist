import { Email } from '@/types/email';

export const mockEmails: Email[] = [
  // ProductEnquiry emails (4)
  {
    id: '1',
    sender: {
      name: 'Dr. Sarah Chen',
      email: 's.chen@stanford.edu',
      organization: 'Stanford University Libraries',
    },
    subject: 'Question about ScienceDirect Complete Collection',
    body: `Dear Elsevier Sales Team,

I hope this email finds you well. I'm the Head of Digital Resources at Stanford University Libraries, and we're currently evaluating our journal subscriptions for the upcoming fiscal year.

We currently have access to a partial ScienceDirect collection, but our faculty have been requesting expanded access to materials in the Health Sciences and Engineering domains. Could you provide information on:

1. What would be included in the Complete Collection that we don't currently have?
2. Are there flexible licensing options for multi-campus access?
3. What analytics and usage reporting tools are available?

Our renewal decision needs to be made by Q1 2025, so I'd appreciate any information you can share at your earliest convenience.

Best regards,
Dr. Sarah Chen
Head of Digital Resources
Stanford University Libraries`,
    preview: "I'm evaluating our journal subscriptions and have questions about the Complete Collection...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'ProductEnquiry',
    folder: 'inbox',
  },
  {
    id: '2',
    sender: {
      name: 'Marcus Williams',
      email: 'm.williams@mayo.edu',
      organization: 'Mayo Clinic',
    },
    subject: 'ClinicalKey features for resident training',
    body: `Hello,

I'm the Director of Medical Education at Mayo Clinic, and we're exploring digital resources to support our resident training program.

I've heard ClinicalKey has some excellent point-of-care features. Could you tell me more about:

- Integration with our existing EMR (Epic)
- Mobile app capabilities for residents on rounds
- Procedural video library
- CME credit tracking

We have approximately 1,500 residents across all programs. What licensing models would be most cost-effective for this scale?

Thanks,
Marcus Williams, MD
Director of Medical Education
Mayo Clinic`,
    preview: "Exploring ClinicalKey for our resident training program. Questions about EMR integration...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'ProductEnquiry',
    folder: 'inbox',
  },
  {
    id: '3',
    sender: {
      name: 'Dr. Priya Sharma',
      email: 'psharma@tcs.com',
      organization: 'Tata Consultancy Services',
    },
    subject: 'Scopus API access for research analytics',
    body: `Dear Elsevier,

TCS Research is building an internal research analytics dashboard and we're interested in integrating Scopus data via API.

We need to:
- Pull citation metrics for our published papers
- Track research output across our 50+ R&D centers globally
- Benchmark our performance against competitors

What API tiers do you offer? What are the rate limits and pricing models?

Also, is there a sandbox environment we could test with?

Best,
Dr. Priya Sharma
Head of Research Analytics
Tata Consultancy Services`,
    preview: "TCS Research needs Scopus API access for an internal analytics dashboard...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'ProductEnquiry',
    folder: 'inbox',
  },
  {
    id: '4',
    sender: {
      name: 'Jennifer Park',
      email: 'j.park@ucsd.edu',
      organization: 'UC San Diego',
    },
    subject: 'Comparison: Mendeley vs other reference managers',
    body: `Hi,

We're reviewing reference management tools for campus-wide deployment. Mendeley is one of our top candidates.

How does Mendeley Institutional Edition compare to alternatives like Zotero or EndNote in terms of:
- Collaboration features
- Storage limits
- Integration with ScienceDirect and Scopus
- Admin controls and analytics

We'd also like to arrange a demo for our evaluation committee.

Thanks,
Jennifer Park
Research Technology Specialist
UC San Diego`,
    preview: "Reviewing reference management tools. How does Mendeley compare to alternatives...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'ProductEnquiry',
    folder: 'inbox',
  },

  // PricingOrRenewalRequest emails (4)
  {
    id: '5',
    sender: {
      name: 'Thomas Mueller',
      email: 't.mueller@tu-munich.de',
      organization: 'Technical University of Munich',
    },
    subject: 'RE: 2025 Subscription Renewal - Quote Request',
    body: `Dear Elsevier Team,

Our current ScienceDirect subscription expires on December 31, 2024. We'd like to begin the renewal process.

Current subscription: ScienceDirect Freedom Collection
Annual spend: ~€2.1M

For 2025, we're interested in:
- Maintaining current access levels
- Adding Cell Press journals package
- Multi-year deal (3 years) for budget predictability

Please send a formal quote at your earliest convenience. Our procurement team needs this by end of month.

Best regards,
Thomas Mueller
Head of Library Acquisitions
Technical University of Munich`,
    preview: "Subscription expires Dec 31, 2024. Requesting 2025 renewal quote for ScienceDirect...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'PricingOrRenewalRequest',
    folder: 'inbox',
  },
  {
    id: '6',
    sender: {
      name: 'Linda Okonkwo',
      email: 'lokonkwo@johnshopkins.edu',
      organization: 'Johns Hopkins University',
    },
    subject: 'Pricing inquiry - Expanding Scopus access',
    body: `Hello,

Johns Hopkins currently has Scopus access for our main campus. We'd like to expand this to include:

- School of Public Health (Bloomberg)
- Applied Physics Laboratory
- Peabody Institute

Could you provide pricing for adding these entities to our existing agreement? We're also interested in understanding if there are tiered pricing options based on FTE counts.

Please also include information on SciVal if bundling is available.

Thank you,
Linda Okonkwo
Director of Library Systems
Johns Hopkins University`,
    preview: "Expanding Scopus access to additional campuses. Requesting pricing for add-ons...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'PricingOrRenewalRequest',
    folder: 'inbox',
  },
  {
    id: '7',
    sender: {
      name: 'Roberto Fernandez',
      email: 'rfernandez@conricyt.mx',
      organization: 'CONRICYT Consortium',
    },
    subject: 'Multi-year agreement renewal for Mexican consortium',
    body: `Dear Elsevier,

As the coordinator for CONRICYT (Mexico's national research consortium), I'm reaching out regarding our upcoming renewal negotiations.

Our consortium includes 150+ institutions with combined research output of 15,000+ papers annually in Elsevier journals.

We'd like to discuss:
- Open Access Read & Publish agreement options
- Cost containment strategies for member institutions
- Enhanced discovery and collaboration tools

When can we schedule a call with your regional team?

Regards,
Roberto Fernandez
Executive Director
CONRICYT`,
    preview: "CONRICYT consortium renewal - 150+ institutions. Interested in Read & Publish agreement...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'PricingOrRenewalRequest',
    folder: 'inbox',
  },
  {
    id: '8',
    sender: {
      name: 'Emily Watson',
      email: 'e.watson@nhs.uk',
      organization: 'NHS England',
    },
    subject: 'Budget approval received - Please resend quote',
    body: `Hi,

Good news! We've received budget approval for the ClinicalKey implementation we discussed last quarter.

Could you please resend the quote? I seem to have misplaced the original. The configuration was:

- ClinicalKey for Physicians
- 12 NHS Trust hospitals
- 3-year term

We're ready to move forward once I have the documentation.

Thanks,
Emily Watson
Procurement Manager
NHS England`,
    preview: "Budget approved for ClinicalKey. Please resend the quote for 12 NHS Trust hospitals...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'PricingOrRenewalRequest',
    folder: 'inbox',
  },

  // AccessOrEntitlementIssue emails (3)
  {
    id: '9',
    sender: {
      name: 'Dr. Ahmed Hassan',
      email: 'a.hassan@kau.edu.sa',
      organization: 'King Abdulaziz University',
    },
    subject: 'URGENT: Students unable to access Scopus',
    body: `Dear Support,

Since yesterday morning, our graduate students have been unable to access Scopus. They're getting an "Access Denied" error even when on campus.

This is critical as we have thesis submission deadlines next week and students need to complete their literature reviews.

Our IT team confirmed the IP ranges haven't changed. Our subscription should be active through June 2025.

Please investigate immediately.

Dr. Ahmed Hassan
Dean of Graduate Studies
King Abdulaziz University, Saudi Arabia`,
    preview: "URGENT: Graduate students getting Access Denied errors on Scopus. Thesis deadlines approaching...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'AccessOrEntitlementIssue',
    folder: 'inbox',
  },
  {
    id: '10',
    sender: {
      name: 'Michelle Laurent',
      email: 'm.laurent@inserm.fr',
      organization: 'INSERM',
    },
    subject: 'Missing access to Cell Reports',
    body: `Hello,

Our researchers are reporting that they cannot access Cell Reports articles published after October 2024.

According to our agreement, we should have perpetual access to all content through 2024 and current access for 2025.

Can you please verify our entitlements and restore access?

Reference: Agreement #FR-INSERM-2024-SD

Merci,
Michelle Laurent
Library Services
INSERM, France`,
    preview: "Cannot access Cell Reports articles from October 2024 onwards. Please verify entitlements...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'AccessOrEntitlementIssue',
    folder: 'inbox',
  },
  {
    id: '11',
    sender: {
      name: 'David Tanaka',
      email: 'd.tanaka@riken.jp',
      organization: 'RIKEN Institute',
    },
    subject: 'ScienceDirect authentication issues after SSO migration',
    body: `Dear Elsevier,

We recently migrated to a new Shibboleth identity provider for our institution. Since the migration, approximately 30% of our researchers cannot authenticate to ScienceDirect.

The affected users can access other federated services without issue, so we believe this may be related to Elsevier's SAML configuration.

Entity ID: https://idp.riken.jp/idp/shibboleth

Can your technical team investigate?

Best,
David Tanaka
IT Security Administrator
RIKEN Institute, Japan`,
    preview: "30% of researchers cannot authenticate after SSO migration. SAML configuration issue...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'AccessOrEntitlementIssue',
    folder: 'inbox',
  },

  // AdminOrMaintenanceRequest emails (3)
  {
    id: '12',
    sender: {
      name: 'Patricia Gomez',
      email: 'pgomez@unam.mx',
      organization: 'UNAM',
    },
    subject: 'Request for invoice copy - 2024 subscription',
    body: `Hello,

Our finance department requires a copy of the 2024 subscription invoice for our year-end audit.

Account: UNAM - Universidad Nacional Autónoma de México
Invoice Period: January - December 2024
Product: ScienceDirect + Scopus bundle

Please send to: cuentaspagar@unam.mx

Thank you,
Patricia Gomez
Administrative Coordinator
UNAM Libraries`,
    preview: "Requesting 2024 invoice copy for year-end audit. ScienceDirect + Scopus bundle...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 420), // 7 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'AdminOrMaintenanceRequest',
    folder: 'inbox',
  },
  {
    id: '13',
    sender: {
      name: 'James Cooper',
      email: 'j.cooper@monash.edu',
      organization: 'Monash University',
    },
    subject: 'Admin portal access for new staff member',
    body: `Hi,

I'm setting up a new team member who will be managing our Elsevier subscriptions. Could you please create an admin account for:

Name: Dr. Helen Nguyen
Email: h.nguyen@monash.edu
Role: Library Resources Manager

She should have the same access level as myself for ScienceDirect Admin and usage reporting.

Thanks,
James Cooper
Director of Library Services
Monash University`,
    preview: "Need admin portal access created for new staff member Dr. Helen Nguyen...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'AdminOrMaintenanceRequest',
    folder: 'inbox',
  },
  {
    id: '14',
    sender: {
      name: 'Anna Kowalski',
      email: 'a.kowalski@uw.edu.pl',
      organization: 'University of Warsaw',
    },
    subject: 'License documentation for internal audit',
    body: `Dear Elsevier,

Our compliance team has requested documentation of our current license terms for an internal audit.

Could you please provide:
1. Current signed agreement
2. Amendment history
3. Authorized user definitions
4. IP range confirmations

This is for compliance purposes only and not related to any renewal negotiations.

Best regards,
Anna Kowalski
Compliance Officer
University of Warsaw`,
    preview: "Requesting license documentation for internal compliance audit. Need signed agreements...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 540), // 9 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'AdminOrMaintenanceRequest',
    folder: 'inbox',
  },

  // DelegateToSalesOps emails (2)
  {
    id: '15',
    sender: {
      name: 'Michael Chen',
      email: 'm.chen@elsevier.com',
      organization: 'Elsevier Finance',
    },
    subject: 'Internal: Commission structure clarification needed',
    body: `Hi,

I'm reconciling Q3 commissions and noticed a discrepancy in the Johns Hopkins deal that closed in September.

The commission rate applied was 2.5%, but based on the deal size ($1.2M+), it should have been at the 3% tier per the 2024 comp plan.

Can you confirm the deal structure and whether any special terms were applied?

Thanks,
Michael
Finance Operations`,
    preview: "Internal: Q3 commission discrepancy on Johns Hopkins deal needs clarification...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 600), // 10 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'DelegateToSalesOps',
    folder: 'inbox',
  },
  {
    id: '16',
    sender: {
      name: 'Sarah Miller',
      email: 's.miller@elsevier.com',
      organization: 'Elsevier Legal',
    },
    subject: 'Contract review request - UCLA amendment',
    body: `Hello,

Legal has received the amendment request from UCLA for their ScienceDirect agreement. Before we proceed with review, I need confirmation on:

1. Is this a standard price adjustment or are there scope changes?
2. Are there any side letters or verbal commitments to account for?
3. What's the target completion date?

Please route this to the appropriate team member if you're not the deal owner.

Thanks,
Sarah Miller
Senior Contract Counsel
Elsevier Legal`,
    preview: "Internal: Legal needs clarification on UCLA contract amendment before review...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 660), // 11 hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'DelegateToSalesOps',
    folder: 'inbox',
  },

  // HighValueSalesConversation emails (3)
  {
    id: '17',
    sender: {
      name: 'Dr. Elizabeth Warren',
      email: 'e.warren@harvard.edu',
      organization: 'Harvard University',
    },
    subject: 'RE: Strategic partnership discussion - Following up',
    body: `Dear [Sales Rep],

Thank you for the productive meeting last week. I've discussed your proposal with the Provost's office and we're interested in exploring a more comprehensive partnership.

Specifically, we're considering:
- Expanded ScienceDirect access across all schools
- Pilot program for AI-assisted research tools
- Joint research initiatives with Elsevier Labs
- Exclusive early access to new platform features

This would be a significant investment for Harvard (est. $15-20M over 5 years), so I'll need to present a compelling case to the Board.

Can we schedule a follow-up call next week to discuss?

Best,
Dr. Elizabeth Warren
Vice Provost for Research
Harvard University`,
    preview: "Following up on strategic partnership. Interested in $15-20M 5-year comprehensive deal...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'HighValueSalesConversation',
    folder: 'inbox',
  },
  {
    id: '18',
    sender: {
      name: 'Prof. Richard Dawson',
      email: 'r.dawson@ox.ac.uk',
      organization: 'University of Oxford',
    },
    subject: 'Concerns about renewal terms - Need to discuss',
    body: `Hello,

I've reviewed the renewal proposal and I have significant concerns about the proposed 8% year-over-year increase given our flat budget situation.

Oxford has been a loyal Elsevier partner for decades, and I'd like to find a solution that works for both parties rather than considering alternatives.

Could we arrange a call this week to discuss creative options? I believe there's mutual value in preserving this relationship.

Prof. Richard Dawson
Bodley's Librarian
University of Oxford`,
    preview: "Concerns about 8% renewal increase. Wants to discuss alternatives before making decisions...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 75), // 1.25 hours ago
    isRead: false,
    isHandled: false,
    detectedIntent: 'HighValueSalesConversation',
    folder: 'inbox',
  },
  {
    id: '19',
    sender: {
      name: 'Dr. Yuki Tanaka',
      email: 'y.tanaka@u-tokyo.ac.jp',
      organization: 'University of Tokyo',
    },
    subject: 'RE: Japan National License - Final decision pending',
    body: `Dear Elsevier Team,

The steering committee met yesterday to discuss the Japan National License proposal. We're close to a decision but need clarification on two points:

1. The transformative agreement component - how are APC waivers calculated for hybrid journals?
2. Governance structure - how will participating institutions have input on future terms?

This deal would cover 87 national universities. We want to ensure it sets a positive precedent for the region.

I'm available for a call tomorrow between 9-11 AM JST if that works for your team.

Regards,
Dr. Yuki Tanaka
Chair, Japan University Libraries Consortium`,
    preview: "Japan National License final decision pending. 87 universities. Need clarification on terms...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 200), // 3+ hours ago
    isRead: true,
    isHandled: false,
    detectedIntent: 'HighValueSalesConversation',
    folder: 'inbox',
  },
];

export const getUnreadCount = (emails: Email[], folder: string = 'inbox'): number => {
  return emails.filter(e => e.folder === folder && !e.isRead && !e.isHandled).length;
};
