import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Email, AssistantMessage, APIAnalysisResponse, UserRole } from '@/types/email';
import { cn } from '@/lib/utils';
import { 
  Bot, Send, Sparkles, Brain, Lightbulb, AlertCircle, 
  ShoppingCart, Headphones, X, Workflow, Loader2, CheckCircle2,
  User, UserCog
} from 'lucide-react';

type AgentType = 'sales' | 'support' | null;

interface ProcessStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
}

interface CopilotPanelProps {
  email: Email;
  isOpen: boolean;
  onClose: () => void;
}

const API_ENDPOINT = 'http://10.73.85.107:5000';

export function CopilotPanel({ email, isOpen, onClose }: CopilotPanelProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType>(null);
  const [apiResponse, setApiResponse] = useState<APIAnalysisResponse | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('sales_rep');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Reset state when email changes
  useEffect(() => {
    setMessages([]);
    setActiveAgent(null);
    setApiResponse(null);
    setProcessSteps([]);
    setHasAnalyzed(false);
    setIsAnalyzing(false);
  }, [email.id]);

  const analyzeEmail = async () => {
    setIsAnalyzing(true);
    setHasAnalyzed(true);
    
    // Initialize process steps
    const initialSteps: ProcessStep[] = [
      { id: '1', name: 'Email Classifier', status: 'pending' },
      { id: '2', name: 'Intent Detector', status: 'pending' },
      { id: '3', name: 'Agent Router', status: 'pending' },
      { id: '4', name: 'Response Generator', status: 'pending' },
    ];
    setProcessSteps(initialSteps);

    try {
      // Step 1: Classifying
      setProcessSteps(prev => prev.map(s => s.id === '1' ? { ...s, status: 'running' } : s));
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: {
            sender_email: email.sender.email,
            subject: email.subject,
            body: email.body,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: APIAnalysisResponse = await response.json();
      
      // Update steps progressively
      setProcessSteps(prev => prev.map(s => 
        s.id === '1' ? { ...s, status: 'completed', output: `Category: ${data.category}` } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 400));
      setProcessSteps(prev => prev.map(s => 
        s.id === '2' ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessSteps(prev => prev.map(s => 
        s.id === '2' ? { ...s, status: 'completed', output: `Intent: ${data.intent}` } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 400));
      setProcessSteps(prev => prev.map(s => 
        s.id === '3' ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
      const agentType = data.category?.toLowerCase() === 'sales' ? 'sales' : 'support';
      setActiveAgent(agentType);
      setProcessSteps(prev => prev.map(s => 
        s.id === '3' ? { ...s, status: 'completed', output: `Routing to ${agentType === 'sales' ? 'Sales' : 'Support'} Agent` } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 400));
      setProcessSteps(prev => prev.map(s => 
        s.id === '4' ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessSteps(prev => prev.map(s => 
        s.id === '4' ? { ...s, status: 'completed', output: data.recommended_action || 'Recommendation generated' } : s
      ));

      setApiResponse(data);

    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback to local analysis
      const fallbackCategory = detectCategoryLocally(email);
      const fallbackIntent = detectIntentLocally(email, fallbackCategory);
      
      setProcessSteps(prev => prev.map(s => ({
        ...s,
        status: 'completed',
        output: s.id === '1' ? `Category: ${fallbackCategory}` :
                s.id === '2' ? `Intent: ${fallbackIntent}` :
                s.id === '3' ? `Routing to ${fallbackCategory === 'sales' ? 'Sales' : 'Support'} Agent` :
                'Local analysis completed'
      })));

      setActiveAgent(fallbackCategory);
      setApiResponse({
        category: fallbackCategory,
        intent: fallbackIntent,
        confidence: 85,
        summary: `${fallbackCategory === 'sales' ? 'Sales' : 'Support'} query detected`,
        recommended_action: fallbackCategory === 'sales' 
          ? 'Review and prepare quote/proposal' 
          : 'Create support ticket and resolve issue',
        agent_type: fallbackCategory,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectCategoryLocally = (email: Email): 'sales' | 'support' => {
    const bodyLower = email.body.toLowerCase();
    const subjectLower = email.subject.toLowerCase();
    
    const supportKeywords = ['refund', 'access denied', 'cannot access', 'password', 'reset', 'error', 'urgent', 'issue', 'problem'];
    const salesKeywords = ['pricing', 'quote', 'api', 'subscription', 'license', 'purchase', 'budget', 'proposal'];
    
    const supportScore = supportKeywords.filter(kw => bodyLower.includes(kw) || subjectLower.includes(kw)).length;
    const salesScore = salesKeywords.filter(kw => bodyLower.includes(kw) || subjectLower.includes(kw)).length;
    
    return supportScore > salesScore ? 'support' : 'sales';
  };

  const detectIntentLocally = (email: Email, category: 'sales' | 'support'): string => {
    const bodyLower = email.body.toLowerCase();
    
    if (category === 'sales') {
      if (bodyLower.includes('api')) return 'ProductEnquiry';
      if (bodyLower.includes('pricing')) return 'PricingRequest';
      if (bodyLower.includes('renewal')) return 'RenewalRequest';
      return 'ProductEnquiry';
    } else {
      if (bodyLower.includes('refund')) return 'ProductRefund';
      if (bodyLower.includes('password')) return 'PasswordChange';
      if (bodyLower.includes('access')) return 'AccessIssue';
      return 'TechnicalSupport';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    let responseContent = '';
    if (apiResponse) {
      responseContent = `Based on the analysis:\n\n**Category:** ${apiResponse.category}\n**Intent:** ${apiResponse.intent}\n**Confidence:** ${apiResponse.confidence}%\n\n${apiResponse.summary}\n\n**Recommended Action:** ${apiResponse.recommended_action}`;
    } else {
      responseContent = 'Please click "Analyze Email" first to get AI-powered insights.';
    }

    const assistantMessage: AssistantMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue('');
  };

  const handleOpenAgenticFlow = () => {
    navigate('/agentic-flow', { 
      state: { 
        email, 
        apiResponse,
        processSteps 
      } 
    });
  };

  const getStepIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
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

      {/* User Role Selector */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">Current User Role</p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentUserRole('sales_rep')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-smooth",
              currentUserRole === 'sales_rep'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <User className="w-3 h-3" />
            Sales Rep
          </button>
          <button
            onClick={() => setCurrentUserRole('sales_manager')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-smooth",
              currentUserRole === 'sales_manager'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <UserCog className="w-3 h-3" />
            Sales Manager
          </button>
        </div>
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
        {!hasAnalyzed ? (
          <div className="p-4 flex flex-col items-center justify-center gap-4 h-48">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click below to analyze this email and identify the category and intent
            </p>
            <button
              onClick={analyzeEmail}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth text-sm font-medium flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Email
                </>
              )}
            </button>
          </div>
        ) : isAnalyzing ? (
          <div className="p-4 animate-fade-in">
            <p className="text-sm font-medium text-foreground mb-3">Processing...</p>
            <div className="space-y-2">
              {processSteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    step.status === 'running' && "bg-primary/5",
                    step.status === 'completed' && "bg-green-500/5"
                  )}
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.name}</p>
                    {step.output && (
                      <p className="text-xs text-muted-foreground">{step.output}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Process Steps Summary */}
            <div className="p-3 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Analysis Steps</p>
              <div className="space-y-1.5">
                {processSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    {getStepIcon(step.status)}
                    <span className="font-medium">{step.name}</span>
                    {step.output && (
                      <span className="text-muted-foreground ml-auto">{step.output}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category Detection */}
            {apiResponse && (
              <div className="p-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    apiResponse.category?.toLowerCase() === 'sales' ? "bg-green-500/20" : "bg-blue-500/20"
                  )}>
                    {apiResponse.category?.toLowerCase() === 'sales' ? (
                      <ShoppingCart className="w-3 h-3 text-green-600" />
                    ) : (
                      <Headphones className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-foreground">
                      {apiResponse.category} → {apiResponse.intent}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            apiResponse.category?.toLowerCase() === 'sales' ? "bg-green-500" : "bg-blue-500"
                          )}
                          style={{ width: `${apiResponse.confidence || 85}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{apiResponse.confidence || 85}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {/* API Response Panel */}
            {apiResponse && (
              <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{apiResponse.summary}</p>
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
                      <p className="text-sm text-primary mt-1">{apiResponse.recommended_action}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="p-3 space-y-3 min-h-[100px]">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Ask the {activeAgent || ''} agent about this email
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
