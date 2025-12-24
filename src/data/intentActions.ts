import { EmailIntent, ActionButton } from '@/types/email';

export const intentActions: Record<EmailIntent, ActionButton[]> = {
  ProductEnquiry: [
    {
      id: 'send-standard',
      label: 'Send Standard Response',
      icon: 'Send',
      variant: 'primary',
      feedbackMessage: 'Standard response sent to customer',
      timeSaved: '10 min',
    },
    {
      id: 'share-product-info',
      label: 'Share Product Info',
      icon: 'FileText',
      variant: 'secondary',
      feedbackMessage: 'Product information package sent',
      timeSaved: '15 min',
    },
    {
      id: 'delegate-inside-sales',
      label: 'Delegate to Inside Sales',
      icon: 'UserPlus',
      variant: 'secondary',
      feedbackMessage: 'Request delegated to Inside Sales team',
      timeSaved: '20 min',
    },
  ],
  PricingOrRenewalRequest: [
    {
      id: 'generate-quote',
      label: 'Generate Quote Draft',
      icon: 'FileSpreadsheet',
      variant: 'primary',
      feedbackMessage: 'Quote draft generated and ready for review',
      timeSaved: '25 min',
    },
    {
      id: 'forward-renewals',
      label: 'Forward to Renewals',
      icon: 'Forward',
      variant: 'secondary',
      feedbackMessage: 'Request forwarded to Renewals team',
      timeSaved: '15 min',
    },
    {
      id: 'request-missing-info',
      label: 'Request Missing Info',
      icon: 'HelpCircle',
      variant: 'secondary',
      feedbackMessage: 'Information request sent to customer',
      timeSaved: '10 min',
    },
  ],
  AccessOrEntitlementIssue: [
    {
      id: 'create-ticket',
      label: 'Create Support Ticket',
      icon: 'Ticket',
      variant: 'primary',
      feedbackMessage: 'Support ticket created and assigned',
      timeSaved: '15 min',
    },
    {
      id: 'delegate-support',
      label: 'Delegate to Customer Support',
      icon: 'Headphones',
      variant: 'secondary',
      feedbackMessage: 'Request delegated to Customer Support',
      timeSaved: '20 min',
    },
  ],
  AdminOrMaintenanceRequest: [
    {
      id: 'auto-reply-faq',
      label: 'Auto-Reply with FAQ',
      icon: 'MessageSquare',
      variant: 'primary',
      feedbackMessage: 'FAQ response sent automatically',
      timeSaved: '10 min',
    },
    {
      id: 'delegate-salesops',
      label: 'Delegate to Sales Ops',
      icon: 'Users',
      variant: 'secondary',
      feedbackMessage: 'Request delegated to Sales Ops',
      timeSaved: '15 min',
    },
  ],
  DelegateToSalesOps: [
    {
      id: 'handoff-salesops',
      label: 'Hand Off to Sales Ops',
      icon: 'ArrowRightCircle',
      variant: 'primary',
      feedbackMessage: 'Request handed off to Sales Ops',
      timeSaved: '20 min',
    },
  ],
  HighValueSalesConversation: [],
};

export const assistantPrompts: Record<EmailIntent, string[]> = {
  ProductEnquiry: [
    "I've detected a product enquiry. Would you like me to send a standard response with product information?",
    "This looks like a request for product details. Should I share our product brochure and schedule a demo?",
  ],
  PricingOrRenewalRequest: [
    "This appears to be a renewal enquiry. Should I forward it to the renewals team or generate a quote draft?",
    "I've identified a pricing request. Would you like me to pull up the customer's account history to help with the quote?",
  ],
  AccessOrEntitlementIssue: [
    "This seems like an access issue. Should I create a support ticket or escalate to the technical team?",
    "I've detected an entitlement problem. Would you like me to delegate this to Customer Support for faster resolution?",
  ],
  AdminOrMaintenanceRequest: [
    "This is an administrative request. I can auto-reply with our FAQ or delegate to Sales Ops. Which would you prefer?",
    "I've identified a maintenance request. Should I handle this automatically or would you like to review first?",
  ],
  DelegateToSalesOps: [
    "This appears to be an internal request. Should I hand this off to Sales Ops?",
    "I've detected an internal operations matter. Would you like me to route this to the appropriate team?",
  ],
  HighValueSalesConversation: [
    "This is a high-value conversation that requires your personal attention. I'm here to help with research or drafting if needed.",
    "I've flagged this as a strategic opportunity. Would you like me to pull up account history or prepare talking points?",
  ],
};
