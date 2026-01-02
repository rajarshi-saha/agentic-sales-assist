import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Email, AssistantMessage, EmailCategory, EmailIntent } from '@/types/email';
import { cn } from '@/lib/utils';
import { Bot, Send, Sparkles, Brain, Lightbulb, AlertCircle, TrendingUp, Headphones, ShoppingCart, X, Workflow } from 'lucide-react';
import { analyzeEmail, generateRecommendation, generateContextualResponse, EmailAnalysis, AgentRecommendation } from '@/lib/emailAnalyzer';

type AgentType = 'sales' | 'support' | null;

interface CopilotPanelProps {
  email: Email;
  isOpen: boolean;
  onClose: () => void;
}

export function CopilotPanel({ email, isOpen, onClose }: CopilotPanelProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeAgent, setActiveAgent] = useState<AgentType>(null);

  // Analyze email on mount/change
  const analysis = useMemo(() => analyzeEmail(email), [email]);
  const recommendation = useMemo(() => generateRecommendation(email, analysis), [email, analysis]);

  // Simulate analysis delay
  useEffect(() => {
    setIsAnalyzing(true);
    setMessages([]);
    setActiveAgent(null);
    
    const timer = setTimeout(() => {
      setActiveAgent(analysis.category);
      setIsAnalyzing(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [email.id, analysis.category]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    const responseContent = generateContextualResponse(inputValue, email, analysis, recommendation);

    const assistantMessage: AssistantMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue('');
  };

  const handleOpenAgenticFlow = () => {
    navigate('/agentic-flow', { state: { email, analysis } });
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

  if (!isOpen) return null;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground block">AI Copilot</span>
            <span className="text-xs text-muted-foreground">Intelligent assistance</span>
          </div>
          <Sparkles className="w-3 h-3 text-primary animate-pulse-subtle" />
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-smooth"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Agent Selection Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveAgent('sales')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-smooth",
            activeAgent === 'sales' 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          Sales
        </button>
        <button
          onClick={() => setActiveAgent('support')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-smooth",
            activeAgent === 'support' 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Headphones className="w-4 h-4" />
          Support
        </button>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isAnalyzing ? (
          <div className="p-4 flex flex-col items-center justify-center gap-3 h-32">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Analyzing email context...</span>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Category Detection */}
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  analysis.category === 'sales' ? "bg-green-500/20" : "bg-blue-500/20"
                )}>
                  {analysis.category === 'sales' ? (
                    <ShoppingCart className="w-3 h-3 text-green-600" />
                  ) : (
                    <Headphones className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-foreground">
                    {analysis.category === 'sales' ? 'Sales Query' : 'Support Query'} → {analysis.intent}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          analysis.category === 'sales' ? "bg-green-500" : "bg-blue-500"
                        )}
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{analysis.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agentic Flow Button */}
            <div className="p-3 border-b border-border">
              <button
                onClick={handleOpenAgenticFlow}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-smooth text-sm font-medium"
              >
                <Workflow className="w-4 h-4" />
                View Agentic Flow
              </button>
            </div>

            {/* Analysis Panel */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{recommendation.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full bg-muted", getUrgencyColor(analysis.urgency))}>
                      {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)} priority
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">
                      {getSentimentIcon(analysis.sentiment)} {analysis.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activeAgent === 'sales' ? 'Sales' : 'Support'} Agent
                    </p>
                    <p className="text-sm text-primary mt-1">{recommendation.primaryAction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-3 space-y-3 min-h-[100px]">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Ask the {activeAgent} agent about this email
                </p>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 animate-fade-in",
                    message.type === 'user' && "flex-row-reverse"
                  )}
                >
                  {message.type === 'assistant' && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      activeAgent === 'sales' 
                        ? "bg-gradient-to-br from-green-500 to-green-600" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    )}>
                      {activeAgent === 'sales' ? (
                        <ShoppingCart className="w-3 h-3 text-white" />
                      ) : (
                        <Headphones className="w-3 h-3 text-white" />
                      )}
                    </div>
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%]",
                    message.type === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  )}>
                    <p className="text-xs whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${activeAgent || 'the'} agent...`}
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
  );
}
