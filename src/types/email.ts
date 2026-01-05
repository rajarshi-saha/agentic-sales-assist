export type EmailCategory = 'sales' | 'support';

export type SalesIntent =
  | 'ProductEnquiry'
  | 'PricingRequest'
  | 'RenewalRequest'
  | 'HighValueOpportunity';

export type SupportIntent =
  | 'ProductRefund'
  | 'AccountReset'
  | 'PasswordChange'
  | 'AccessIssue'
  | 'TechnicalSupport';

export type EmailIntent = SalesIntent | SupportIntent;

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

export type UserRole = 'sales_rep' | 'sales_manager';

export interface AgentStep {
  id: string;
  agentName: string;
  agentType: 'classifier' | 'analyzer' | 'sales' | 'support' | 'router';
  status: 'pending' | 'running' | 'completed' | 'error';
  input?: string;
  output?: string;
  duration?: number;
}

export interface EmailAnalysis {
  category: EmailCategory;
  intent: EmailIntent;
  confidence: number;
  customerType: 'academic' | 'healthcare' | 'corporate' | 'consortium' | 'government' | 'individual';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  products: string[];
  keyRequirements: string[];
  estimatedDealValue: 'high' | 'medium' | 'low' | 'unknown';
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  decisionMaker: boolean;
  actionableInsights: string[];
}

export interface APIAnalysisResponse {
  category: string;
  intent: string;
  confidence: number;
  summary: string;
  recommended_action: string;
  agent_type: string;
  steps?: Array<{
    step: string;
    status: string;
    output?: string;
  }>;
}

export interface AgenticWorkflow {
  emailId: string;
  category: EmailCategory;
  intent: EmailIntent;
  steps: AgentStep[];
  startTime: Date;
  endTime?: Date;
}
