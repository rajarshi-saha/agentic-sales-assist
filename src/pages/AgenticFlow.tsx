import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Email, AgentStep, APIAnalysisResponse } from '@/types/email';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Brain, 
  ShoppingCart, 
  Headphones, 
  CheckCircle2, 
  Loader2, 
  Circle,
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  User,
  UserCog
} from 'lucide-react';

interface ProcessStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
}

export default function AgenticFlowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, apiResponse, processSteps: passedSteps } = (location.state as { 
    email?: Email; 
    apiResponse?: APIAnalysisResponse;
    processSteps?: ProcessStep[];
  }) || {};
  
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedStep, setSelectedStep] = useState<AgentStep | null>(null);

  useEffect(() => {
    if (!email) return;

    const category = apiResponse?.category?.toLowerCase() || 'sales';
    const intent = apiResponse?.intent || 'ProductEnquiry';

    const workflowSteps: AgentStep[] = [
      {
        id: '1',
        agentName: 'Email Classifier',
        agentType: 'classifier',
        status: 'pending',
        input: `Subject: ${email.subject}\nFrom: ${email.sender.name} <${email.sender.email}>`,
        output: '',
      },
      {
        id: '2',
        agentName: 'Context Analyzer',
        agentType: 'analyzer',
        status: 'pending',
        input: 'Analyzing email content, metadata, and sender information...',
        output: '',
      },
      {
        id: '3',
        agentName: 'Intent Router',
        agentType: 'router',
        status: 'pending',
        input: `Category: ${category}`,
        output: '',
      },
      {
        id: '4',
        agentName: category === 'sales' ? 'Sales Agent' : 'Support Agent',
        agentType: category === 'sales' ? 'sales' : 'support',
        status: 'pending',
        input: `Intent: ${intent}`,
        output: '',
      },
    ];

    setSteps(workflowSteps);
    runWorkflow(workflowSteps, category, intent, apiResponse);
  }, [email?.id]);

  const runWorkflow = async (
    workflowSteps: AgentStep[], 
    category: string, 
    intent: string,
    response?: APIAnalysisResponse
  ) => {
    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStepIndex(i);
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 1200));

      const outputs = [
        `Detected: ${category === 'sales' ? 'Sales Query' : 'Support Query'} (${response?.confidence || 85}% confidence)`,
        `Sender: ${email?.sender.organization || 'Unknown Organization'} | Email: ${email?.sender.email}`,
        `Routing to ${category === 'sales' ? 'Sales' : 'Support'} Agent with intent: ${intent}`,
        response?.recommended_action || `${category === 'sales' ? 'Generate quote or schedule demo' : 'Create ticket and resolve issue'}`,
      ];

      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed', output: outputs[i], duration: 1200 } : s
      ));
    }

    setIsComplete(true);
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No email selected for analysis</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStepIcon = (step: AgentStep) => {
    switch (step.agentType) {
      case 'classifier': return Brain;
      case 'analyzer': return Target;
      case 'router': return ArrowRight;
      case 'sales': return ShoppingCart;
      case 'support': return Headphones;
      default: return FileText;
    }
  };

  const getStatusIcon = (status: AgentStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'running': return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'error': return <Circle className="w-5 h-5 text-destructive" />;
      default: return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Agentic Workflow</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Email Info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-4">
              <p className="text-sm text-muted-foreground mb-2">Email Details</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-medium text-sm">{email.sender.name}</p>
                  <p className="text-xs text-muted-foreground">{email.sender.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-medium text-sm">{email.subject}</p>
                </div>
                {apiResponse && (
                  <>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <div className="flex items-center gap-2 mt-1">
                        {apiResponse.category?.toLowerCase() === 'sales' ? (
                          <ShoppingCart className="w-4 h-4 text-green-500" />
                        ) : (
                          <Headphones className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="font-medium text-sm">{apiResponse.category}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Intent</p>
                      <p className="font-medium text-sm">{apiResponse.intent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${apiResponse.confidence || 85}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{apiResponse.confidence || 85}%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Workflow Steps */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = getStepIcon(step);
                const isActive = index === currentStepIndex;
                
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step)}
                    className={cn(
                      "border rounded-lg p-4 transition-all duration-300 cursor-pointer hover:shadow-md",
                      step.status === 'completed' && "border-green-500/50 bg-green-500/5",
                      step.status === 'running' && "border-primary bg-primary/5 shadow-lg",
                      step.status === 'pending' && "border-border bg-card opacity-50",
                      selectedStep?.id === step.id && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        step.status === 'completed' && "bg-green-500/20",
                        step.status === 'running' && "bg-primary/20",
                        step.status === 'pending' && "bg-muted"
                      )}>
                        <StepIcon className={cn(
                          "w-6 h-6",
                          step.status === 'completed' && "text-green-600",
                          step.status === 'running' && "text-primary",
                          step.status === 'pending' && "text-muted-foreground"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-lg">{step.agentName}</h3>
                          {getStatusIcon(step.status)}
                        </div>
                        
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Step {index + 1} of {steps.length}
                        </p>
                        
                        {step.input && (
                          <div className="p-2 bg-muted/50 rounded text-sm mb-2">
                            <span className="text-muted-foreground font-medium">Input: </span>
                            <span className="whitespace-pre-line">{step.input}</span>
                          </div>
                        )}
                        
                        {step.output && (
                          <div className="p-2 bg-green-500/10 rounded text-sm">
                            <span className="text-green-600 font-medium">Output: </span>
                            {step.output}
                          </div>
                        )}
                        
                        {step.duration && step.status === 'completed' && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed in {step.duration}ms
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {isComplete && (
              <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-lg text-green-700">Workflow Complete</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  All agents have processed the email successfully
                </p>
                {apiResponse?.recommended_action && (
                  <div className="bg-card border border-border rounded-lg p-4 mt-4 text-left">
                    <p className="text-sm font-medium text-foreground mb-1">Recommended Action:</p>
                    <p className="text-sm text-primary">{apiResponse.recommended_action}</p>
                  </div>
                )}
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
                >
                  Back to Inbox
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
