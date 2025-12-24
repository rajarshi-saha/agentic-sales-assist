import { Email } from '@/types/email';
import { format } from 'date-fns';
import { IntentBadge } from './IntentBadge';
import { ActionSurface } from './ActionSurface';
import { SalesAssistant } from './SalesAssistant';
import { Mail } from 'lucide-react';

interface ReadingPaneProps {
  email: Email | null;
  onAction: (actionId: string, feedbackMessage: string, timeSaved?: string) => void;
}

export function ReadingPane({ email, onAction }: ReadingPaneProps) {
  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
        <Mail className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Select an email to read</p>
        <p className="text-sm mt-1">Choose an email from the list to view its contents</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-fade-in">
      {/* Action Surface */}
      <ActionSurface email={email} onAction={onAction} />

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 animate-slide-in-right">
          {/* Email Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4">
              {/* Sender Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                {email.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Sender Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-semibold text-foreground">
                    {email.sender.name}
                  </h2>
                  <IntentBadge intent={email.detectedIntent} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {email.sender.email}
                  {email.sender.organization && (
                    <span className="text-muted-foreground/70"> • {email.sender.organization}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(email.receivedTime, "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            {/* Subject */}
            <h1 className="text-xl font-semibold text-foreground mt-4">
              {email.subject}
            </h1>
          </div>

          {/* Email Body */}
          <div className="prose prose-sm max-w-none text-foreground">
            {email.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 leading-relaxed text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Sales Assistant */}
        <div className="px-6 pb-6">
          <SalesAssistant email={email} />
        </div>
      </div>
    </div>
  );
}
