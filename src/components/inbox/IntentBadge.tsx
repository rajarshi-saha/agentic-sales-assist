import { cn } from '@/lib/utils';
import { EmailIntent } from '@/types/email';
import { 
  Package, 
  DollarSign, 
  KeyRound, 
  Settings, 
  Users, 
  Zap 
} from 'lucide-react';

interface IntentBadgeProps {
  intent: EmailIntent;
  size?: 'sm' | 'md';
}

const intentConfig: Record<EmailIntent, { 
  label: string; 
  className: string; 
  icon: React.ComponentType<{ className?: string }>;
}> = {
  ProductEnquiry: {
    label: 'Product Enquiry',
    className: 'intent-product',
    icon: Package,
  },
  PricingOrRenewalRequest: {
    label: 'Pricing / Renewal',
    className: 'intent-pricing',
    icon: DollarSign,
  },
  AccessOrEntitlementIssue: {
    label: 'Access Issue',
    className: 'intent-access',
    icon: KeyRound,
  },
  AdminOrMaintenanceRequest: {
    label: 'Admin Request',
    className: 'intent-admin',
    icon: Settings,
  },
  DelegateToSalesOps: {
    label: 'Sales Ops',
    className: 'intent-salesops',
    icon: Users,
  },
  HighValueSalesConversation: {
    label: 'High Value',
    className: 'intent-highvalue',
    icon: Zap,
  },
};

export function IntentBadge({ intent, size = 'md' }: IntentBadgeProps) {
  const config = intentConfig[intent];
  const Icon = config.icon;

  return (
    <span className={cn(
      "intent-badge inline-flex items-center gap-1",
      config.className,
      size === 'sm' && "text-[10px] px-1.5 py-0.5"
    )}>
      <Icon className={cn("shrink-0", size === 'sm' ? "w-2.5 h-2.5" : "w-3 h-3")} />
      {config.label}
    </span>
  );
}
