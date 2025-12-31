import { Email } from '@/types/email';
import { intentActions } from '@/data/intentActions';
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
  Zap,
  Sparkles
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
};

export function ActionSurface({ email, onAction, onAnalyze }: ActionSurfaceProps) {
  const actions = intentActions[email.detectedIntent];
  const isHighValue = email.detectedIntent === 'HighValueSalesConversation';

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
        {isHighValue ? (
          <>
            <div className="focus-required">
              <Zap className="w-4 h-4" />
              <span>Focus Required — Strategic Conversation</span>
            </div>
            {onAnalyze && (
              <button
                onClick={onAnalyze}
                className="action-btn bg-gradient-to-r from-primary to-primary/80 animate-fade-in"
              >
                <Sparkles className="w-4 h-4" />
                Analyze
              </button>
            )}
          </>
        ) : (
          <>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mr-1">
              Quick Actions:
            </span>
            {actions.map((action, index) => {
              const Icon = iconMap[action.icon] || Send;
              return (
                <button
                  key={action.id}
                  onClick={() => onAction(action.id, action.feedbackMessage, action.timeSaved)}
                  className={cn(
                    action.variant === 'primary' ? 'action-btn' : 'action-btn-secondary',
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
            {onAnalyze && (
              <button
                onClick={onAnalyze}
                className="action-btn bg-gradient-to-r from-primary to-primary/80 animate-fade-in"
                style={{ animationDelay: `${actions.length * 50}ms` }}
              >
                <Sparkles className="w-4 h-4" />
                Analyze
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
