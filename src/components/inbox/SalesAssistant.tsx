import { useState, useMemo, useEffect } from 'react';
import { Email, AssistantMessage } from '@/types/email';
import { cn } from '@/lib/utils';
import { Bot, Send, ChevronDown, ChevronUp, Sparkles, Brain, Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';
import { analyzeEmail, generateRecommendation, generateContextualResponse, EmailAnalysis, AgentRecommendation } from '@/lib/emailAnalyzer';

interface SalesAssistantProps {
  email: Email;
}

export function SalesAssistant({ email }: SalesAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Analyze email on mount/change
  const analysis = useMemo(() => analyzeEmail(email), [email]);
  const recommendation = useMemo(() => generateRecommendation(email, analysis), [email, analysis]);

  // Simulate analysis delay
  useEffect(() => {
    setIsAnalyzing(true);
    setMessages([]);
    const timer = setTimeout(() => setIsAnalyzing(false), 800);
    return () => clearTimeout(timer);
  }, [email.id]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    // Generate contextual response based on email analysis
    const responseContent = generateContextualResponse(inputValue, email, analysis, recommendation);

    const assistantMessage: AssistantMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue('');
  };

  const getUrgencyColor = (urgency: EmailAnalysis['urgency']) => {
    switch (urgency) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: EmailAnalysis['sentiment']) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'frustrated': return '😤';
      case 'urgent': return '⏰';
      default: return '📧';
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden animate-fade-in-up">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-smooth"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-sm text-foreground block">Sales Agent</span>
            <span className="text-xs text-muted-foreground">Context-aware assistance</span>
          </div>
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
          {/* Analysis Panel */}
          <div className="p-4 border-b border-border bg-muted/30">
            {isAnalyzing ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Analyzing email context...</span>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {/* Context Summary */}
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{recommendation.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full bg-muted", getUrgencyColor(analysis.urgency))}>
                        {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)} priority
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">
                        {getSentimentIcon(analysis.sentiment)} {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                      </span>
                      {analysis.decisionMaker && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          Decision-maker
                        </span>
                      )}
                      {analysis.estimatedDealValue !== 'unknown' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {analysis.estimatedDealValue.charAt(0).toUpperCase() + analysis.estimatedDealValue.slice(1)} value
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products Detected */}
                {analysis.products.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Products:</span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.products.map((product) => (
                        <span key={product} className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Recommended action</p>
                      <p className="text-sm text-primary mt-1">{recommendation.primaryAction}</p>
                      <p className="text-xs text-muted-foreground mt-1">{recommendation.reasoning}</p>
                      {recommendation.timeSensitivity && (
                        <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {recommendation.timeSensitivity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                {analysis.actionableInsights.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="text-muted-foreground font-medium">Insights:</span>
                    <ul className="space-y-0.5">
                      {analysis.actionableInsights.slice(0, 3).map((insight, i) => (
                        <li key={i} className="text-foreground flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
            {messages.length === 0 && !isAnalyzing && (
              <p className="text-xs text-muted-foreground text-center py-2">
                Ask me about this email, request alternatives, or get talking points
              </p>
            )}

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
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
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
                placeholder="Ask about this email... (e.g., 'Why?' 'Talking points?' 'Draft response')"
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
