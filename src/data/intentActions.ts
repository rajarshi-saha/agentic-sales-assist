import { EmailCategory, EmailIntent, ActionButton } from '@/types/email';

// Sales intent actions
export const salesIntentActions: Record<string, ActionButton[]> = {
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
      id: 'schedule-demo',
      label: 'Schedule Demo',
      icon: 'Calendar',
      variant: 'secondary',
      feedbackMessage: 'Demo scheduled with customer',
      timeSaved: '20 min',
    },
  ],
  PricingRequest: [
    {
      id: 'generate-quote',
      label: 'Generate Quote Draft',
      icon: 'FileSpreadsheet',
      variant: 'primary',
      feedbackMessage: 'Quote draft generated and ready for review',
      timeSaved: '25 min',
    },
    {
      id: 'send-pricing',
      label: 'Send Pricing Sheet',
      icon: 'DollarSign',
      variant: 'secondary',
      feedbackMessage: 'Pricing sheet sent to customer',
      timeSaved: '15 min',
    },
  ],
  RenewalRequest: [
    {
      id: 'forward-renewals',
      label: 'Forward to Renewals',
      icon: 'Forward',
      variant: 'primary',
      feedbackMessage: 'Request forwarded to Renewals team',
      timeSaved: '15 min',
    },
    {
      id: 'generate-renewal-quote',
      label: 'Generate Renewal Quote',
      icon: 'FileSpreadsheet',
      variant: 'secondary',
      feedbackMessage: 'Renewal quote generated',
      timeSaved: '20 min',
    },
  ],
  HighValueOpportunity: [
    {
      id: 'priority-response',
      label: 'Priority Response',
      icon: 'Zap',
      variant: 'primary',
      feedbackMessage: 'Priority response drafted',
      timeSaved: '30 min',
    },
  ],
};

// Support intent actions
export const supportIntentActions: Record<string, ActionButton[]> = {
  ProductRefund: [
    {
      id: 'process-refund',
      label: 'Process Refund',
      icon: 'CreditCard',
      variant: 'primary',
      feedbackMessage: 'Refund processed successfully',
      timeSaved: '15 min',
    },
    {
      id: 'verify-transaction',
      label: 'Verify Transaction',
      icon: 'Search',
      variant: 'secondary',
      feedbackMessage: 'Transaction verification initiated',
      timeSaved: '10 min',
    },
  ],
  AccountReset: [
    {
      id: 'reset-account',
      label: 'Reset Account',
      icon: 'RefreshCw',
      variant: 'primary',
      feedbackMessage: 'Account reset initiated',
      timeSaved: '10 min',
    },
    {
      id: 'send-verification',
      label: 'Send Verification',
      icon: 'Mail',
      variant: 'secondary',
      feedbackMessage: 'Verification email sent',
      timeSaved: '5 min',
    },
  ],
  PasswordChange: [
    {
      id: 'send-reset-link',
      label: 'Send Reset Link',
      icon: 'Key',
      variant: 'primary',
      feedbackMessage: 'Password reset link sent',
      timeSaved: '5 min',
    },
    {
      id: 'escalate-it',
      label: 'Escalate to IT',
      icon: 'AlertCircle',
      variant: 'secondary',
      feedbackMessage: 'Issue escalated to IT team',
      timeSaved: '10 min',
    },
  ],
  AccessIssue: [
    {
      id: 'create-ticket',
      label: 'Create Support Ticket',
      icon: 'Ticket',
      variant: 'primary',
      feedbackMessage: 'Support ticket created and assigned',
      timeSaved: '15 min',
    },
    {
      id: 'grant-temp-access',
      label: 'Grant Temporary Access',
      icon: 'Unlock',
      variant: 'secondary',
      feedbackMessage: 'Temporary access granted',
      timeSaved: '10 min',
    },
  ],
  TechnicalSupport: [
    {
      id: 'escalate-technical',
      label: 'Escalate to Technical',
      icon: 'Headphones',
      variant: 'primary',
      feedbackMessage: 'Issue escalated to technical team',
      timeSaved: '20 min',
    },
    {
      id: 'send-troubleshooting',
      label: 'Send Troubleshooting Guide',
      icon: 'FileText',
      variant: 'secondary',
      feedbackMessage: 'Troubleshooting guide sent',
      timeSaved: '10 min',
    },
  ],
};

export function getActionsForIntent(category: EmailCategory, intent: EmailIntent): ActionButton[] {
  if (category === 'sales') {
    return salesIntentActions[intent] || [];
  }
  return supportIntentActions[intent] || [];
}
