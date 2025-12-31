import { useState, useCallback } from 'react';
import { Email } from '@/types/email';
import { mockEmails, getUnreadCount } from '@/data/mockEmails';
import { NavigationPane } from './NavigationPane';
import { EmailListPane } from './EmailListPane';
import { ReadingPane } from './ReadingPane';
import { ActionFeedback } from './ActionFeedback';

interface FeedbackState {
  id: string;
  message: string;
  timeSaved?: string;
}

export function InboxLayout() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);

  const filteredEmails = emails.filter(e => e.folder === activeFolder);
  const selectedEmail = emails.find(e => e.id === selectedEmailId) || null;
  const unreadCount = getUnreadCount(emails);

  const handleSelectEmail = useCallback((email: Email) => {
    setSelectedEmailId(email.id);
    
    // Mark as read
    if (!email.isRead) {
      setEmails(prev => 
        prev.map(e => 
          e.id === email.id ? { ...e, isRead: true } : e
        )
      );
    }
  }, []);

  const handleAction = useCallback((actionId: string, feedbackMessage: string, timeSaved?: string) => {
    // Mark email as handled
    if (selectedEmailId) {
      setEmails(prev =>
        prev.map(e =>
          e.id === selectedEmailId ? { ...e, isHandled: true, isRead: true } : e
        )
      );
    }

    // Show feedback
    setFeedback({
      id: Date.now().toString(),
      message: feedbackMessage,
      timeSaved,
    });
  }, [selectedEmailId]);

  const handleFeedbackComplete = useCallback(() => {
    setFeedback(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    setShowCopilot(true);
  }, []);

  const handleCloseCopilot = useCallback(() => {
    setShowCopilot(false);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Navigation Pane */}
      <NavigationPane
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        unreadCount={unreadCount}
      />

      {/* Email List Pane */}
      <EmailListPane
        emails={filteredEmails}
        selectedEmailId={selectedEmailId}
        onSelectEmail={handleSelectEmail}
      />

      {/* Reading Pane */}
      <ReadingPane
        email={selectedEmail}
        onAction={handleAction}
        onAnalyze={handleAnalyze}
        showCopilot={showCopilot}
        onCloseCopilot={handleCloseCopilot}
      />

      {/* Action Feedback Toast */}
      {feedback && (
        <ActionFeedback
          key={feedback.id}
          message={feedback.message}
          timeSaved={feedback.timeSaved}
          onComplete={handleFeedbackComplete}
        />
      )}
    </div>
  );
}
