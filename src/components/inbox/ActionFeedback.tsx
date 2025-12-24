import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock } from 'lucide-react';

interface ActionFeedbackProps {
  message: string;
  timeSaved?: string;
  onComplete: () => void;
}

export function ActionFeedback({ message, timeSaved, onComplete }: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isVisible ? "animate-slide-up" : "opacity-0 translate-y-4"
      )}
    >
      <div className="bg-card border border-border shadow-lg rounded-lg p-4 min-w-[320px] max-w-md">
        <div className="flex items-start gap-3">
          {/* Success icon */}
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0 animate-check-mark">
            <Check className="w-5 h-5 text-success" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">{message}</p>
            {timeSaved && (
              <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">Estimated {timeSaved} saved</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              You're free to focus on deals
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-success rounded-full transition-all duration-[4000ms] ease-linear"
            style={{ width: isVisible ? '0%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
