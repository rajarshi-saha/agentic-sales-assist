import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Email, AgentStep, EmailAnalysis } from '@/types/email';
import { analyzeEmail } from '@/lib/emailAnalyzer';
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
  FileText
} from 'lucide-react';

export default function AgenticFlowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, analysis: passedAnalysis } = (location.state as { email?: Email; analysis?: EmailAnalysis }) || {};
  
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const analysis = passedAnalysis || (email ? analyzeEmail(email) : null);

  useEffect(() => {
    if (!email || !analysis) return;

    const workflowSteps: AgentStep[] = [
      {
        id: '1',
        agentName: 'Email Classifier',
        agentType: 'classifier',
        status: 'pending',
        input: `Subject: ${email.subject}\nFrom: ${email.sender.name}`,
        output: '',
      },
      {
        id: '2',
        agentName: 'Context Analyzer',
        agentType: 'analyzer',
        status: 'pending',
        input: 'Analyzing email content and metadata...',
        output: '',
      },
      {
        id: '3',
        agentName: 'Intent Router',
        agentType: 'router',
        status: 'pending',
        input: `Category: ${analysis.category}`,
        output: '',
      },
      {
        id: '4',
        agentName: analysis.category === 'sales' ? 'Sales Agent' : 'Support Agent',
        agentType: analysis.category === 'sales' ? 'sales' : 'support',
        status: 'pending',
        input: `Intent: ${analysis.intent}`,
        output: '',
      },
    ];

    setSteps(workflowSteps);
    runWorkflow(workflowSteps);
  }, [email?.id]);

  const runWorkflow = async (workflowSteps: AgentStep[]) => {
    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStepIndex(i);
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'running' } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 1500));

      const outputs = [
        `Detected: ${analysis?.category === 'sales' ? 'Sales Query' : 'Support Query'} (${analysis?.confidence}% confidence)`,
        `Customer: ${analysis?.customerType} | Urgency: ${analysis?.urgency} | Sentiment: ${analysis?.sentiment}`,
        `Routing to ${analysis?.category === 'sales' ? 'Sales' : 'Support'} Agent with intent: ${analysis?.intent}`,
        `Recommendation: ${analysis?.category === 'sales' ? 'Generate quote or schedule demo' : 'Create ticket and resolve access issue'}`,
      ];

      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed', output: outputs[i], duration: 1500 } : s
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
        <div className="max-w-4xl mx-auto px-6 py-4">
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Email Summary */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground">Analyzing email from</p>
          <p className="font-medium">{email.sender.name} - {email.subject}</p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step);
            const isActive = index === currentStepIndex;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "border rounded-lg p-4 transition-all duration-300",
                  step.status === 'completed' && "border-green-500/50 bg-green-500/5",
                  step.status === 'running' && "border-primary bg-primary/5 shadow-lg",
                  step.status === 'pending' && "border-border bg-card opacity-50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    step.status === 'completed' && "bg-green-500/20",
                    step.status === 'running' && "bg-primary/20",
                    step.status === 'pending' && "bg-muted"
                  )}>
                    <StepIcon className={cn(
                      "w-5 h-5",
                      step.status === 'completed' && "text-green-600",
                      step.status === 'running' && "text-primary",
                      step.status === 'pending' && "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{step.agentName}</h3>
                      {getStatusIcon(step.status)}
                    </div>
                    
                    {step.input && (
                      <p className="text-sm text-muted-foreground mt-1">{step.input}</p>
                    )}
                    
                    {step.output && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        <span className="text-green-600 font-medium">Output: </span>
                        {step.output}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-green-700">Workflow Complete</p>
            <p className="text-sm text-muted-foreground mt-1">
              All agents have processed the email successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
