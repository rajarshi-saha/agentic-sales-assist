import { Email } from '@/types/email';
import { getActionsForIntent } from '@/data/intentActions';
import { analyzeEmail } from '@/lib/emailAnalyzer';
import { cn } from '@/lib/utils';
import { 
  Send, 
  FileText, 
  UserPlus, 
  FileSpreadsheet, 
  Forward, 
  HelpCircle, 
  Ticket, 
  Headphones, 
  MessageSquare, 
  Users, 
  ArrowRightCircle,
  Sparkles,
  CreditCard,
  Search,
  RefreshCw,
  Mail,
  Key,
  AlertCircle,
  Unlock,
  DollarSign,
  Calendar,
  Zap
} from 'lucide-react';

interface ActionSurfaceProps {
  email: Email;
  onAction: (actionId: string, feedbackMessage: string, timeSaved?: string) => void;
  onAnalyze?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Send,
  FileText,
  UserPlus,
  FileSpreadsheet,
  Forward,
  HelpCircle,
  Ticket,
  Headphones,
  MessageSquare,
  Users,
  ArrowRightCircle,
  CreditCard,
  Search,
  RefreshCw,
  Mail,
  Key,
  AlertCircle,
  Unlock,
  DollarSign,
  Calendar,
  Zap,
};

export function ActionSurface({ email, onAction, onAnalyze }: ActionSurfaceProps) {
  if (email.isHandled) {
    return (
      <div className="px-6 py-3 bg-success/10 border-b border-success/20 animate-fade-in">
        <div className="flex items-center gap-2 text-success">
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <svg className="w-3 h-3 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium">This email has been handled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-3 bg-muted/50 border-b border-border animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mr-1">
          Quick Actions:
        </span>
        {onAnalyze && (
          <button
            onClick={onAnalyze}
            className="action-btn bg-gradient-to-r from-primary to-primary/80 animate-fade-in"
          >
            <Sparkles className="w-4 h-4" />
            Analyze
          </button>
        )}
      </div>
    </div>
  );
}
