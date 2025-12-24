import { useState } from 'react';
import { Email, AssistantMessage } from '@/types/email';
import { assistantPrompts } from '@/data/intentActions';
import { cn } from '@/lib/utils';
import { Bot, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface SalesAssistantProps {
  email: Email;
}

const scriptedResponses: Record<string, string> = {
  'yes': "Great! I'm preparing that for you now. The action will be completed momentarily.",
  'no': "No problem. Let me know if you need any other assistance with this email.",
  'help': "I can help you with:\n• Sending standard responses\n• Delegating to internal teams\n• Creating support tickets\n• Generating quote drafts\n\nJust tell me what you need!",
  'delegate': "I'll route this to the appropriate team right away. They'll receive all the context from this email.",
  'draft': "I'm drafting a response based on the email context. You can review and edit before sending.",
  'schedule': "Would you like me to suggest some available time slots for a follow-up call?",
  'account': "I can pull up the account history for this customer. This includes past purchases, support tickets, and renewal dates.",
  'default': "I understand. I'm here to help with any routine tasks so you can focus on what matters most. Just let me know what you need.",
};

export function SalesAssistant({ email }: SalesAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const prompts = assistantPrompts[email.detectedIntent];
  const initialPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    // Find matching scripted response
    const lowerInput = inputValue.toLowerCase();
    let responseContent = scriptedResponses.default;
    
    for (const [key, response] of Object.entries(scriptedResponses)) {
      if (lowerInput.includes(key)) {
        responseContent = response;
        break;
      }
    }

    const assistantMessage: AssistantMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue('');
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden animate-fade-in-up">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-smooth"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm text-foreground">Sales Assistant</span>
          <Sparkles className="w-3 h-3 text-primary animate-pulse-subtle" />
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="animate-fade-in">
          {/* Messages */}
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {/* Initial prompt */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 max-w-[85%]">
                <p className="text-sm text-foreground">{initialPrompt}</p>
              </div>
            </div>

            {/* Conversation history */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.type === 'user' && "flex-row-reverse"
                )}
              >
                {message.type === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-[85%]",
                  message.type === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground"
                )}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm bg-muted rounded border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
