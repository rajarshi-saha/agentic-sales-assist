import { Email } from '@/types/email';

export type UserRole = 'sales_rep' | 'sales_manager';

export interface EmailWithRole extends Email {
  assignedTo?: UserRole;
}

export const mockEmails: Email[] = [
  // Sales Query Emails
  {
    id: '1',
    sender: {
      name: 'Amanda Clark',
      email: 'amanda.clark@example.com',
      organization: 'TCS Research',
    },
    subject: 'Request for Scopus API for Research Analytics',
    body: `Dear Elsevier Team,

I am writing on behalf of TCS Research as we are currently developing an internal research analytics dashboard. We are interested in integrating Scopus data through your API to enhance our capabilities.

Specifically, we aim to:
- Pull citation metrics for our published papers
- Track research output across more than 50 global R&D centers
- Benchmark our performance against competitors

Could you please provide details on the available API tiers, including rate limits and pricing models? Additionally, is there a sandbox environment that we can use for testing purposes?

Looking forward to your response.

Best regards,
Dr. Priya Sharma
Head of Research Analytics
Tata Consultancy Services`,
    preview: 'Writing on behalf of TCS Research for Scopus API integration...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '2',
    sender: {
      name: 'Brian Ramirez',
      email: 'brian.ramirez@example.com',
      organization: 'Stanford Medical Center',
    },
    subject: 'ClinicalKey Pricing for Residency Program',
    body: `Dear Sales Team,

I'm the Director of Medical Education at Stanford Medical Center. We're looking to expand our ClinicalKey subscription to include our entire residency program of 150+ residents.

Could you please provide pricing information for:
- Multi-year licensing options (3-year preferred)
- Integration with our Epic EMR system
- Mobile access for residents during rounds

We have budget approval for this fiscal year and would like to move quickly. Our current subscription expires in 6 weeks.

Looking forward to your proposal.

Best regards,
Dr. Maria Santos
Director of Medical Education`,
    preview: "Director of Medical Education looking to expand ClinicalKey...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '3',
    sender: {
      name: 'Catherine Lewis',
      email: 'catherine.lewis@example.com',
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
    preview: 'Graduate students unable to access Scopus - Access Denied error...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 45),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '4',
    sender: {
      name: 'David Robinson',
      email: 'david.robinson@example.com',
      organization: 'Research Institute',
    },
    subject: 'Refund Request – ScienceDirect PPV Order PO-20251231-001',
    body: `Dear Elsevier Customer Support Team,

I am writing to request a refund for a recently purchased ScienceDirect Pay-Per-View (PPV) article. Below are the details of the transaction:

- Purchase Order Number: PO-20251231-001
- Article DOI: 10.1016/j.scitotenv.2025.123456
- Reason for Refund: The article was mistakenly purchased and I have discovered that it is already available through my institution's subscription.

I kindly request that you process a refund for this purchase. Please let me know if any additional information is required or if there are further steps I need to take to facilitate this request.

Thank you for your assistance. I appreciate your prompt attention to this matter and look forward to your confirmation of the refund.

Sincerely,
[Your Name]
Researcher, [Your Institution]
[Your Contact Information]`,
    preview: 'Request for refund of ScienceDirect PPV article...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '5',
    sender: {
      name: 'Dr. Ahmed Hassan',
      email: 'a.hassan@cairo-university.edu',
      organization: 'Cairo University',
    },
    subject: 'URGENT: Cannot Access Purchased Journals - Thesis Deadline',
    body: `Dear Support,

I'm a PhD student and I CANNOT access journals I purchased yesterday. My thesis defense is in 3 days and I desperately need these articles.

Order ID: ELS-2024-78432
Articles: 5 journal articles totaling $175

I keep getting "Access Denied" errors even though payment was confirmed. Please help urgently!

My account email: a.hassan@cairo-university.edu

Regards,
Ahmed Hassan`,
    preview: "CANNOT access journals I purchased yesterday. Thesis deadline...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: true,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '6',
    sender: {
      name: 'Linda Martinez',
      email: 'l.martinez@healthco.com',
      organization: 'HealthCo Medical Group',
    },
    subject: 'Password Reset Not Working - Admin Account',
    body: `Hello Support Team,

I'm the IT administrator for HealthCo Medical Group. I'm trying to reset my admin password for our institutional ClinicalKey account but the reset emails are not arriving.

I've checked spam folders and tried multiple times over the past 24 hours. Our 50 physicians are unable to add new users until this is resolved.

Account: admin@healthco.com
Phone: 555-0123

Please escalate this issue.

Thanks,
Linda Martinez
IT Administrator`,
    preview: "Trying to reset admin password but reset emails are not arriving...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '7',
    sender: {
      name: 'Robert Taylor',
      email: 'r.taylor@bigpharma.com',
      organization: 'BigPharma Corp',
    },
    subject: 'Enterprise License Renewal - Multi-Year Deal Discussion',
    body: `Hi Sales Team,

Good news - our procurement committee has approved budget for a 5-year renewal of our enterprise ScienceDirect license.

Current contract value: $2.1M annually
Preferred term: 5-year agreement with 3% annual cap

We'd also like to discuss adding Scopus and SciVal to our bundle. Can we schedule a call this week to discuss terms?

Best regards,
Robert Taylor
Chief Procurement Officer`,
    preview: 'Procurement approved budget for 5-year renewal...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isRead: true,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '8',
    sender: {
      name: 'Prof. Elena Kowalski',
      email: 'e.kowalski@mit.edu',
      organization: 'MIT',
    },
    subject: 'Account Access Revoked - Need Immediate Restoration',
    body: `Dear Support,

My institutional access to ScienceDirect has been revoked even though MIT's subscription is active. I have a grant deadline tomorrow and need access to download research papers.

I've verified with our library that the subscription is current. Other faculty members are also reporting similar issues.

This is affecting multiple researchers. Please investigate urgently.

Prof. Elena Kowalski
Department of Chemistry`,
    preview: 'Institutional access revoked even though subscription is active...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
];

export function getUnreadCount(emails: Email[]): number {
  return emails.filter(e => !e.isRead && e.folder === 'inbox').length;
}
