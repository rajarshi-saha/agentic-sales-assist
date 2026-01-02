import { Email } from '@/types/email';

export const mockEmails: Email[] = [
  // Sales Query Emails
  {
    id: '1',
    sender: {
      name: 'Dr. Maria Santos',
      email: 'm.santos@stanford-medical.edu',
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
    preview: "I'm the Director of Medical Education looking to expand ClinicalKey...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '2',
    sender: {
      name: 'James Chen',
      email: 'j.chen@tcs-research.com',
      organization: 'TCS Research Labs',
    },
    subject: 'ScienceDirect API Access - Enterprise Quote Request',
    body: `Hello,

TCS Research Labs is interested in your ScienceDirect API for our internal research platform. We need:

- Full text access to approximately 50,000 articles per year
- Real-time API integration
- Analytics and usage dashboards
- Support for multiple concurrent users (200+)

This is for our R&D division with a budget of around $1.2M annually. Could you arrange a technical demo and provide enterprise pricing?

Best,
James Chen
VP of Research Operations`,
    preview: 'TCS Research Labs is interested in your ScienceDirect API...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '3',
    sender: {
      name: 'Sarah Williams',
      email: 's.williams@oxford.ac.uk',
      organization: 'Oxford University Press',
    },
    subject: 'Product Information - Scopus vs Web of Science',
    body: `Hi there,

We're evaluating citation databases for our university library system. Could you provide detailed information on:

- How Scopus compares to Web of Science
- Coverage of humanities and social sciences
- Pricing for academic institutions
- Trial access options

We have a committee meeting in 2 weeks and need this information for our evaluation report.

Thank you,
Sarah Williams
Library Acquisitions`,
    preview: "We're evaluating citation databases for our university library...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '4',
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
    preview: 'Good news - our procurement committee has approved budget for a 5-year renewal...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isRead: true,
    isHandled: false,
    folder: 'inbox',
  },
  // Support Query Emails
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
    preview: "I CANNOT access journals I purchased yesterday. My thesis defense...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 45),
    isRead: false,
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
    preview: "I'm trying to reset my admin password but reset emails are not arriving...",
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
  {
    id: '7',
    sender: {
      name: 'Michael Brown',
      email: 'm.brown@techstart.io',
      organization: 'TechStart Inc',
    },
    subject: 'Refund Request - Duplicate Subscription Charge',
    body: `Hi,

I was charged twice for my Mendeley Teams subscription this month. 

Transaction 1: $49.99 on Jan 15
Transaction 2: $49.99 on Jan 16

Both have the same reference number: MEN-2024-5567

Please process a refund for the duplicate charge to my credit card ending in 4521.

Account email: m.brown@techstart.io

Thanks,
Michael Brown`,
    preview: 'I was charged twice for my Mendeley Teams subscription this month...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
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
    preview: 'My institutional access to ScienceDirect has been revoked...',
    receivedTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false,
    isHandled: false,
    folder: 'inbox',
  },
];

export function getUnreadCount(emails: Email[]): number {
  return emails.filter(e => !e.isRead && e.folder === 'inbox').length;
}
