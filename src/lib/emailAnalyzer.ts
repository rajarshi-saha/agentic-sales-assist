import { Email, EmailCategory, EmailIntent, SalesIntent, SupportIntent, EmailAnalysis } from '@/types/email';

export interface AgentRecommendation {
  summary: string;
  primaryAction: string;
  reasoning: string;
  alternatives: string[];
  talkingPoints?: string[];
  riskFactors?: string[];
  timeSensitivity?: string;
}

// Categorize email as sales or support
export function categorizeEmail(email: Email): { category: EmailCategory; confidence: number } {
  const bodyLower = email.body.toLowerCase();
  const subjectLower = email.subject.toLowerCase();
  
  // Sales keywords
  const salesKeywords = [
    'pricing', 'quote', 'purchase', 'buy', 'subscription', 'upgrade', 
    'license', 'proposal', 'contract', 'renewal', 'expand', 'budget', 
    'cost', 'discount', 'deal', 'demo', 'trial', 'enterprise', 'bundle',
    'multi-year', 'annual', 'proposal', 'negotiate'
  ];
  
  // Support keywords
  const supportKeywords = [
    'error', 'issue', 'problem', 'access denied', 'login', 'password', 
    'help', 'support', 'not working', 'cannot', 'trouble', 'failed', 
    'reset', 'blocked', 'refund', 'charge', 'duplicate', 'urgent',
    'revoked', 'suspended', 'locked out', 'broken'
  ];
  
  const salesScore = salesKeywords.filter(kw => 
    bodyLower.includes(kw) || subjectLower.includes(kw)
  ).length;
  
  const supportScore = supportKeywords.filter(kw => 
    bodyLower.includes(kw) || subjectLower.includes(kw)
  ).length;
  
  if (salesScore > supportScore) {
    return { 
      category: 'sales', 
      confidence: Math.min(60 + salesScore * 5, 95) 
    };
  }
  
  if (supportScore > salesScore) {
    return { 
      category: 'support', 
      confidence: Math.min(60 + supportScore * 5, 95) 
    };
  }
  
  // Default to sales with lower confidence
  return { category: 'sales', confidence: 50 };
}

// Detect specific intent within category
export function detectIntent(email: Email, category: EmailCategory): { intent: EmailIntent; confidence: number } {
  const bodyLower = email.body.toLowerCase();
  const subjectLower = email.subject.toLowerCase();
  
  if (category === 'sales') {
    // Check for high value indicators
    if (
      bodyLower.includes('$1') || bodyLower.includes('$2') || 
      bodyLower.includes('million') || bodyLower.includes('enterprise') ||
      bodyLower.includes('multi-year') || bodyLower.includes('5-year')
    ) {
      return { intent: 'HighValueOpportunity' as SalesIntent, confidence: 90 };
    }
    
    // Check for renewal
    if (bodyLower.includes('renewal') || bodyLower.includes('renew') || subjectLower.includes('renewal')) {
      return { intent: 'RenewalRequest' as SalesIntent, confidence: 85 };
    }
    
    // Check for pricing
    if (
      bodyLower.includes('pricing') || bodyLower.includes('quote') || 
      bodyLower.includes('cost') || subjectLower.includes('pricing')
    ) {
      return { intent: 'PricingRequest' as SalesIntent, confidence: 85 };
    }
    
    // Default to product enquiry
    return { intent: 'ProductEnquiry' as SalesIntent, confidence: 70 };
  }
  
  // Support intents
  if (bodyLower.includes('refund') || bodyLower.includes('charge') || bodyLower.includes('duplicate')) {
    return { intent: 'ProductRefund' as SupportIntent, confidence: 90 };
  }
  
  if (bodyLower.includes('password') || subjectLower.includes('password')) {
    return { intent: 'PasswordChange' as SupportIntent, confidence: 90 };
  }
  
  if (bodyLower.includes('reset') && bodyLower.includes('account')) {
    return { intent: 'AccountReset' as SupportIntent, confidence: 85 };
  }
  
  if (
    bodyLower.includes('access') && 
    (bodyLower.includes('denied') || bodyLower.includes('revoked') || bodyLower.includes('cannot'))
  ) {
    return { intent: 'AccessIssue' as SupportIntent, confidence: 85 };
  }
  
  // Default to technical support
  return { intent: 'TechnicalSupport' as SupportIntent, confidence: 70 };
}

// Analyze email content to extract context
export function analyzeEmail(email: Email): EmailAnalysis {
  const body = email.body.toLowerCase();
  const org = email.sender.organization?.toLowerCase() || '';
  
  // Get category and intent
  const categoryResult = categorizeEmail(email);
  const intentResult = detectIntent(email, categoryResult.category);

  // Detect customer type
  let customerType: EmailAnalysis['customerType'] = 'individual';
  if (org.includes('clinic') || org.includes('hospital') || org.includes('nhs') || org.includes('medical')) {
    customerType = 'healthcare';
  } else if (org.includes('consortium')) {
    customerType = 'consortium';
  } else if (org.includes('university') || org.includes('edu') || email.sender.email.includes('.edu')) {
    customerType = 'academic';
  } else if (org.includes('corp') || org.includes('inc') || org.includes('labs')) {
    customerType = 'corporate';
  }

  // Detect urgency
  let urgency: EmailAnalysis['urgency'] = 'medium';
  if (body.includes('urgent') || body.includes('critical') || body.includes('immediately') || body.includes('deadline')) {
    urgency = 'critical';
  } else if (body.includes('asap') || body.includes('by end of') || body.includes('tomorrow')) {
    urgency = 'high';
  } else if (body.includes('when convenient') || body.includes('no rush')) {
    urgency = 'low';
  }

  // Detect products mentioned
  const products: string[] = [];
  if (body.includes('sciencedirect')) products.push('ScienceDirect');
  if (body.includes('scopus')) products.push('Scopus');
  if (body.includes('clinicalkey')) products.push('ClinicalKey');
  if (body.includes('mendeley')) products.push('Mendeley');
  if (body.includes('scival')) products.push('SciVal');
  if (body.includes('api')) products.push('API Access');

  // Extract key requirements
  const keyRequirements: string[] = [];
  if (body.includes('pricing') || body.includes('quote') || body.includes('cost')) {
    keyRequirements.push('Pricing information');
  }
  if (body.includes('demo') || body.includes('trial')) {
    keyRequirements.push('Product demonstration');
  }
  if (body.includes('integration') || body.includes('api') || body.includes('emr')) {
    keyRequirements.push('Technical integration');
  }
  if (body.includes('refund')) {
    keyRequirements.push('Refund processing');
  }
  if (body.includes('access')) {
    keyRequirements.push('Access resolution');
  }

  // Estimate deal value
  let estimatedDealValue: EmailAnalysis['estimatedDealValue'] = 'unknown';
  if (body.includes('$1') || body.includes('$2') || body.includes('million') || body.includes('enterprise')) {
    estimatedDealValue = 'high';
  } else if (body.includes('150') || body.includes('200+') || org.includes('university')) {
    estimatedDealValue = 'medium';
  }

  // Detect sentiment
  let sentiment: EmailAnalysis['sentiment'] = 'neutral';
  if (body.includes('good news') || body.includes('approved') || body.includes('ready')) {
    sentiment = 'positive';
  } else if (body.includes('frustrated') || body.includes('disappointed') || body.includes('cannot')) {
    sentiment = 'frustrated';
  } else if (urgency === 'critical' || urgency === 'high') {
    sentiment = 'urgent';
  }

  // Check if sender is decision maker
  const title = email.body.match(/(?:Head|Director|Dean|Manager|Chief|Executive|VP|President|Administrator)/i);
  const decisionMaker = !!title;

  // Generate actionable insights
  const actionableInsights: string[] = [];
  
  if (decisionMaker) {
    actionableInsights.push(`${email.sender.name} is a decision-maker`);
  }
  
  if (estimatedDealValue === 'high') {
    actionableInsights.push('High-value opportunity - prioritize');
  }
  
  if (urgency === 'critical') {
    actionableInsights.push('Time-sensitive - immediate action required');
  }
  
  if (products.length > 1) {
    actionableInsights.push(`Cross-sell opportunity: ${products.join(', ')}`);
  }

  return {
    category: categoryResult.category,
    intent: intentResult.intent,
    confidence: Math.round((categoryResult.confidence + intentResult.confidence) / 2),
    customerType,
    urgency,
    products,
    keyRequirements,
    estimatedDealValue,
    sentiment,
    decisionMaker,
    actionableInsights,
  };
}

// Generate agent recommendation based on analysis
export function generateRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  const { category, intent } = analysis;
  
  if (category === 'sales') {
    return generateSalesRecommendation(email, analysis);
  }
  return generateSupportRecommendation(email, analysis);
}

function generateSalesRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  switch (analysis.intent) {
    case 'HighValueOpportunity':
      return {
        summary: `High-value opportunity from ${email.sender.organization}. Requires personal attention.`,
        primaryAction: 'Review and craft personalized response',
        reasoning: 'High-value deals require executive engagement and customized proposals.',
        alternatives: ['Schedule executive meeting', 'Prepare custom proposal'],
        talkingPoints: ['Multi-year incentives', 'Bundle discounts', 'Strategic partnership'],
        timeSensitivity: 'Respond within 4 hours',
      };
    case 'RenewalRequest':
      return {
        summary: `Renewal request from ${email.sender.organization}.`,
        primaryAction: 'Forward to Renewals team with context',
        reasoning: 'Renewal processes should follow standard procedures for efficiency.',
        alternatives: ['Generate renewal quote', 'Schedule renewal call'],
        timeSensitivity: 'Respond within 24 hours',
      };
    case 'PricingRequest':
      return {
        summary: `Pricing request from ${email.sender.organization}.`,
        primaryAction: 'Generate quote draft',
        reasoning: 'Provide quick pricing to maintain momentum.',
        alternatives: ['Send standard pricing sheet', 'Schedule pricing call'],
        talkingPoints: analysis.keyRequirements,
        timeSensitivity: 'Respond within 24 hours',
      };
    default:
      return {
        summary: `Product enquiry from ${email.sender.organization}.`,
        primaryAction: 'Send standard product information',
        reasoning: 'Standard response should address initial questions.',
        alternatives: ['Schedule demo', 'Share case studies'],
        talkingPoints: ['Product features', 'Integration options', 'Pricing tiers'],
      };
  }
}

function generateSupportRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  switch (analysis.intent) {
    case 'ProductRefund':
      return {
        summary: `Refund request from ${email.sender.name}.`,
        primaryAction: 'Verify transaction and process refund',
        reasoning: 'Quick refund processing improves customer satisfaction.',
        alternatives: ['Escalate to billing', 'Request more information'],
        timeSensitivity: analysis.urgency === 'critical' ? 'Process immediately' : 'Process within 24 hours',
      };
    case 'PasswordChange':
      return {
        summary: `Password reset issue from ${email.sender.name}.`,
        primaryAction: 'Send password reset link via alternate method',
        reasoning: 'Password issues require immediate resolution for access.',
        alternatives: ['Escalate to IT', 'Verify identity and reset manually'],
        timeSensitivity: 'Respond within 2 hours',
      };
    case 'AccountReset':
      return {
        summary: `Account reset request from ${email.sender.name}.`,
        primaryAction: 'Initiate account reset procedure',
        reasoning: 'Account access is critical for customer operations.',
        alternatives: ['Verify identity first', 'Escalate to security team'],
        timeSensitivity: 'Respond within 4 hours',
      };
    case 'AccessIssue':
      return {
        summary: `Access issue reported by ${email.sender.name} at ${email.sender.organization}.`,
        primaryAction: 'Create support ticket and grant temporary access',
        reasoning: analysis.urgency === 'critical' 
          ? 'Critical deadline involved - immediate access restoration needed.'
          : 'Access issues need investigation to prevent recurrence.',
        alternatives: ['Escalate to technical team', 'Verify subscription status'],
        riskFactors: analysis.urgency === 'critical' ? ['Deadline at risk', 'Customer satisfaction impact'] : undefined,
        timeSensitivity: analysis.urgency === 'critical' ? 'Immediate action required' : 'Respond within 4 hours',
      };
    default:
      return {
        summary: `Technical support request from ${email.sender.name}.`,
        primaryAction: 'Create support ticket',
        reasoning: 'Route to appropriate technical team for resolution.',
        alternatives: ['Send troubleshooting guide', 'Schedule support call'],
      };
  }
}

// Generate contextual chat responses
export function generateContextualResponse(
  input: string, 
  email: Email, 
  analysis: EmailAnalysis,
  recommendation: AgentRecommendation
): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('why') || lowerInput.includes('explain')) {
    return `${recommendation.reasoning}\n\n${analysis.actionableInsights.length > 0 ? `Key insights:\n• ${analysis.actionableInsights.join('\n• ')}` : ''}`;
  }

  if (lowerInput.includes('alternative') || lowerInput.includes('other option')) {
    if (recommendation.alternatives.length > 0) {
      return `Alternative approaches:\n\n${recommendation.alternatives.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    }
    return 'The primary action I recommended is the best approach for this situation.';
  }

  if (lowerInput.includes('talking point') || lowerInput.includes('what should i say')) {
    if (recommendation.talkingPoints && recommendation.talkingPoints.length > 0) {
      return `Key talking points:\n\n${recommendation.talkingPoints.map(tp => `• ${tp}`).join('\n')}`;
    }
    return `Focus on addressing their specific questions about ${analysis.products.join(', ') || 'the product'}.`;
  }

  if (lowerInput.includes('risk') || lowerInput.includes('concern')) {
    if (recommendation.riskFactors && recommendation.riskFactors.length > 0) {
      return `Potential risks:\n\n${recommendation.riskFactors.map(rf => `⚠️ ${rf}`).join('\n')}`;
    }
    return 'No significant risks identified for this request.';
  }

  // Default response
  return `Based on my analysis, this is a ${analysis.category} query with ${analysis.intent} intent. ${recommendation.reasoning}`;
}
