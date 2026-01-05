import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Email, APIAnalysisResponse } from '@/types/email';
import { cn } from '@/lib/utils';
import { 
  Brain, Sparkles, X, Workflow, Loader2, CheckCircle2
} from 'lucide-react';

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
  triggerAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

const API_ENDPOINT = 'http://localhost:5000/api/chat';

export function CopilotPanel({ email, isOpen, onClose, triggerAnalysis, onAnalysisComplete }: CopilotPanelProps) {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResponse, setApiResponse] = useState<APIAnalysisResponse | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Reset state when email changes
  useEffect(() => {
    setApiResponse(null);
    setProcessSteps([]);
    setHasAnalyzed(false);
    setIsAnalyzing(false);
  }, [email.id]);

  // Trigger analysis when prop changes
  useEffect(() => {
    if (triggerAnalysis && !hasAnalyzed && !isAnalyzing) {
      analyzeEmail();
      onAnalysisComplete?.();
    }
  }, [triggerAnalysis]);

  const analyzeEmail = async () => {
    setIsAnalyzing(true);
    setHasAnalyzed(true);
    
    // Initialize process steps
    const initialSteps: ProcessStep[] = [
      { id: '1', name: 'Calling API', status: 'running' },
      { id: '2', name: 'Processing Response', status: 'pending' },
    ];
    setProcessSteps(initialSteps);

    try {
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
      
      setProcessSteps([
        { id: '1', name: 'Calling API', status: 'completed', output: 'Connected' },
        { id: '2', name: 'Processing Response', status: 'completed', output: 'Complete' },
      ]);

      setApiResponse(data);

    } catch (error) {
      console.error('API Error:', error);
      setProcessSteps([
        { id: '1', name: 'Calling API', status: 'error', output: 'Failed to connect' },
        { id: '2', name: 'Processing Response', status: 'pending' },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
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
      case 'error': return <X className="w-4 h-4 text-destructive" />;
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {!hasAnalyzed ? (
          <div className="flex flex-col items-center justify-center gap-4 h-48">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click "Analyze" in the email to analyze this email
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="animate-fade-in">
            <p className="text-sm font-medium text-foreground mb-3">Processing...</p>
            <div className="space-y-2">
              {processSteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    step.status === 'running' && "bg-primary/5"
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
        ) : apiResponse ? (
          <div className="animate-fade-in space-y-4">
            {/* Process Steps */}
            <div className="space-y-1.5">
              {processSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-xs">
                  {getStepIcon(step.status)}
                  <span className="font-medium">{step.name}</span>
                  {step.output && (
                    <span className="text-muted-foreground ml-auto">{step.output}</span>
                  )}
                </div>
              ))}
            </div>

            {/* API Response */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Analysis Result</h4>
              
              {apiResponse.category && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{apiResponse.category}</span>
                </div>
              )}
              
              {apiResponse.intent && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intent:</span>
                  <span className="font-medium">{apiResponse.intent}</span>
                </div>
              )}
              
              {apiResponse.confidence && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-medium">{apiResponse.confidence}%</span>
                </div>
              )}
              
              {apiResponse.summary && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">Summary:</p>
                  <p className="text-sm">{apiResponse.summary}</p>
                </div>
              )}
              
              {apiResponse.recommended_action && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">Recommended Action:</p>
                  <p className="text-sm font-medium text-primary">{apiResponse.recommended_action}</p>
                </div>
              )}
            </div>

            {/* Agentic Flow Button */}
            <button
              onClick={handleOpenAgenticFlow}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-smooth text-sm font-medium"
            >
              <Workflow className="w-4 h-4" />
              View Agentic Flow
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 h-48 text-center">
            <X className="w-8 h-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to analyze email. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
