import { Email } from '@/types/email';
import { format } from 'date-fns';
import { ActionSurface } from './ActionSurface';
import { CopilotPanel } from './CopilotPanel';
import { Mail, Reply, ReplyAll, Forward } from 'lucide-react';

interface ReadingPaneProps {
  email: Email | null;
  onAction: (actionId: string, feedbackMessage: string, timeSaved?: string) => void;
  onAnalyze?: () => void;
  showCopilot: boolean;
  onCloseCopilot: () => void;
  triggerAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export function ReadingPane({ email, onAction, onAnalyze, showCopilot, onCloseCopilot, triggerAnalysis, onAnalysisComplete }: ReadingPaneProps) {
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
    <div className="flex-1 flex h-full bg-background overflow-hidden animate-fade-in">
      {/* Main Email Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Action Surface */}
        <ActionSurface email={email} onAction={onAction} onAnalyze={onAnalyze} />

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

                {/* Email Action Icons */}
                <div className="flex items-center gap-1">
                  <button 
                    className="p-2 hover:bg-muted rounded-md transition-smooth group"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
                  </button>
                  <button 
                    className="p-2 hover:bg-muted rounded-md transition-smooth group"
                    title="Reply All"
                  >
                    <ReplyAll className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
                  </button>
                  <button 
                    className="p-2 hover:bg-muted rounded-md transition-smooth group"
                    title="Forward"
                  >
                    <Forward className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
                  </button>
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
        </div>
      </div>

      {/* Copilot Side Panel */}
      {showCopilot && (
        <CopilotPanel 
          email={email} 
          isOpen={showCopilot} 
          onClose={onCloseCopilot}
          triggerAnalysis={triggerAnalysis}
          onAnalysisComplete={onAnalysisComplete}
        />
      )}
    </div>
  );
}
