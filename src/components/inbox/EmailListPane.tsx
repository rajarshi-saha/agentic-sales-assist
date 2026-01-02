import { cn } from '@/lib/utils';
import { Email } from '@/types/email';
import { formatDistanceToNow } from 'date-fns';
import { Check } from 'lucide-react';

interface EmailListPaneProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailListPane({ emails, selectedEmailId, onSelectEmail }: EmailListPaneProps) {
  if (emails.length === 0) {
    return (
      <div className="w-80 border-r border-border flex items-center justify-center text-muted-foreground">
        No emails in this folder
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Inbox</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {emails.filter(e => !e.isRead).length} unread
        </p>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {emails.map((email, index) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              "email-item px-4 py-3 cursor-pointer border-b border-border/50",
              selectedEmailId === email.id && "selected",
              email.isHandled && "opacity-60",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                email.isHandled 
                  ? "bg-success/20 text-success" 
                  : "bg-primary/10 text-primary"
              )}>
                {email.isHandled ? (
                  <Check className="w-5 h-5" />
                ) : (
                  email.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "text-sm truncate",
                    !email.isRead && !email.isHandled ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}>
                    {email.sender.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(email.receivedTime, { addSuffix: false })}
                  </span>
                </div>
                
                <p className={cn(
                  "text-sm truncate mt-0.5",
                  !email.isRead && !email.isHandled ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {email.subject}
                </p>
                
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {email.preview}
                </p>
              </div>

              {/* Unread indicator */}
              {!email.isRead && !email.isHandled && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
