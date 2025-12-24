export type EmailIntent =
  | 'ProductEnquiry'
  | 'PricingOrRenewalRequest'
  | 'AccessOrEntitlementIssue'
  | 'AdminOrMaintenanceRequest'
  | 'DelegateToSalesOps'
  | 'HighValueSalesConversation';

export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
    organization?: string;
  };
  subject: string;
  body: string;
  preview: string;
  receivedTime: Date;
  isRead: boolean;
  isHandled: boolean;
  detectedIntent: EmailIntent;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive';
}

export interface EmailFolder {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface ActionButton {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary';
  feedbackMessage: string;
  timeSaved?: string;
}

export interface AssistantMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
}
