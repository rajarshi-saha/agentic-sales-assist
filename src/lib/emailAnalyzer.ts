import { Email, EmailIntent } from '@/types/email';

export interface EmailAnalysis {
  customerType: 'academic' | 'healthcare' | 'corporate' | 'consortium' | 'government' | 'internal';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  products: string[];
  keyRequirements: string[];
  estimatedDealValue: 'high' | 'medium' | 'low' | 'unknown';
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  decisionMaker: boolean;
  actionableInsights: string[];
}

export interface AgentRecommendation {
  summary: string;
  primaryAction: string;
  reasoning: string;
  alternatives: string[];
  talkingPoints?: string[];
  riskFactors?: string[];
  timeSensitivity?: string;
}

// Analyze email content to extract context
export function analyzeEmail(email: Email): EmailAnalysis {
  const body = email.body.toLowerCase();
  const subject = email.subject.toLowerCase();
  const org = email.sender.organization?.toLowerCase() || '';

  // Detect customer type
  let customerType: EmailAnalysis['customerType'] = 'academic';
  if (org.includes('clinic') || org.includes('hospital') || org.includes('nhs') || org.includes('medical')) {
    customerType = 'healthcare';
  } else if (org.includes('consortium') || org.includes('conricyt')) {
    customerType = 'consortium';
  } else if (org.includes('tcs') || org.includes('consultancy') || org.includes('corp')) {
    customerType = 'corporate';
  } else if (email.sender.email?.includes('@elsevier.com')) {
    customerType = 'internal';
  }

  // Detect urgency
  let urgency: EmailAnalysis['urgency'] = 'medium';
  if (body.includes('urgent') || body.includes('critical') || body.includes('immediately') || subject.includes('urgent')) {
    urgency = 'critical';
  } else if (body.includes('deadline') || body.includes('asap') || body.includes('by end of')) {
    urgency = 'high';
  } else if (body.includes('when convenient') || body.includes('no rush')) {
    urgency = 'low';
  }

  // Detect products mentioned
  const products: string[] = [];
  if (body.includes('sciencedirect') || subject.includes('sciencedirect')) products.push('ScienceDirect');
  if (body.includes('scopus')) products.push('Scopus');
  if (body.includes('clinicalkey')) products.push('ClinicalKey');
  if (body.includes('mendeley')) products.push('Mendeley');
  if (body.includes('scival')) products.push('SciVal');
  if (body.includes('cell') || body.includes('cell press')) products.push('Cell Press');
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
  if (body.includes('multi-year') || body.includes('3-year') || body.includes('long-term')) {
    keyRequirements.push('Multi-year agreement');
  }
  if (body.includes('open access') || body.includes('read & publish')) {
    keyRequirements.push('Open Access/Transformative agreement');
  }
  if (body.includes('access') && (body.includes('denied') || body.includes('issue') || body.includes('problem'))) {
    keyRequirements.push('Access resolution');
  }

  // Estimate deal value
  let estimatedDealValue: EmailAnalysis['estimatedDealValue'] = 'unknown';
  if (body.includes('€2.1m') || body.includes('$1.2m') || body.includes('150+ institutions') || body.includes('consortium')) {
    estimatedDealValue = 'high';
  } else if (body.includes('12') && body.includes('hospital') || body.includes('1,500 residents')) {
    estimatedDealValue = 'high';
  } else if (org.includes('university') || org.includes('clinic')) {
    estimatedDealValue = 'medium';
  }

  // Detect sentiment
  let sentiment: EmailAnalysis['sentiment'] = 'neutral';
  if (body.includes('good news') || body.includes('approved') || body.includes('ready to move forward')) {
    sentiment = 'positive';
  } else if (body.includes('frustrated') || body.includes('disappointed') || body.includes('unacceptable')) {
    sentiment = 'frustrated';
  } else if (urgency === 'critical' || urgency === 'high') {
    sentiment = 'urgent';
  }

  // Check if sender is decision maker
  const title = email.body.match(/(?:Head|Director|Dean|Manager|Chief|Executive|Coordinator|VP|President)/i);
  const decisionMaker = !!title;

  // Generate actionable insights
  const actionableInsights: string[] = [];
  
  if (decisionMaker) {
    actionableInsights.push(`${email.sender.name} is a decision-maker (${title?.[0] || 'Senior role'})`);
  }
  
  if (estimatedDealValue === 'high') {
    actionableInsights.push('High-value opportunity - prioritize personal attention');
  }
  
  if (body.includes('renewal') && body.includes('expires')) {
    actionableInsights.push('Active renewal window - time-sensitive decision');
  }
  
  if (body.includes('competitor') || body.includes('alternative') || body.includes('zotero') || body.includes('endnote')) {
    actionableInsights.push('Competitive evaluation in progress');
  }

  if (products.length > 1) {
    actionableInsights.push(`Cross-sell opportunity: ${products.join(', ')}`);
  }

  return {
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
  const intent = email.detectedIntent;
  
  switch (intent) {
    case 'ProductEnquiry':
      return generateProductEnquiryRecommendation(email, analysis);
    case 'PricingOrRenewalRequest':
      return generatePricingRecommendation(email, analysis);
    case 'AccessOrEntitlementIssue':
      return generateAccessIssueRecommendation(email, analysis);
    case 'AdminOrMaintenanceRequest':
      return generateAdminRecommendation(email, analysis);
    case 'DelegateToSalesOps':
      return generateSalesOpsRecommendation(email, analysis);
    case 'HighValueSalesConversation':
      return generateHighValueRecommendation(email, analysis);
    default:
      return {
        summary: 'I need more context to provide a recommendation.',
        primaryAction: 'Review email manually',
        reasoning: 'Unable to classify this email clearly.',
        alternatives: ['Forward to manager', 'Request clarification'],
      };
  }
}

function generateProductEnquiryRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  const products = analysis.products.length > 0 ? analysis.products.join(', ') : 'our products';
  
  if (analysis.customerType === 'healthcare') {
    return {
      summary: `Healthcare product enquiry from ${email.sender.organization}. ${analysis.decisionMaker ? 'Decision-maker involved.' : ''}`,
      primaryAction: 'Send tailored healthcare solutions package',
      reasoning: `Healthcare clients typically have specific compliance and integration needs. ${analysis.products.includes('ClinicalKey') ? 'ClinicalKey is a strong fit for clinical workflows.' : ''}`,
      alternatives: [
        'Schedule product demo with clinical specialist',
        'Share case studies from similar healthcare institutions',
        'Connect with Inside Sales for follow-up'
      ],
      talkingPoints: [
        'EMR integration capabilities (Epic, Cerner)',
        'Point-of-care decision support features',
        'CME tracking and compliance reporting',
        'Mobile access for rounds'
      ],
      timeSensitivity: analysis.urgency === 'high' ? 'Respond within 24 hours' : 'Standard response time',
    };
  }

  if (analysis.customerType === 'corporate') {
    return {
      summary: `Corporate R&D enquiry about ${products} from ${email.sender.organization}.`,
      primaryAction: 'Send enterprise API and analytics package info',
      reasoning: 'Corporate clients often need API access and analytics for internal dashboards. Focus on integration and ROI.',
      alternatives: [
        'Arrange technical consultation call',
        'Share enterprise customer testimonials',
        'Provide sandbox environment access'
      ],
      talkingPoints: [
        'API rate limits and pricing tiers',
        'Data integration options',
        'Competitive benchmarking capabilities',
        'Global multi-site licensing'
      ],
    };
  }

  return {
    summary: `Product enquiry about ${products} from ${email.sender.organization}.`,
    primaryAction: 'Send standard product information package',
    reasoning: `${analysis.decisionMaker ? 'This is from a decision-maker, so personalization may help.' : 'Standard response should address their questions.'}`,
    alternatives: [
      'Schedule a demo',
      'Delegate to Inside Sales for follow-up',
      'Share relevant case studies'
    ],
    talkingPoints: analysis.keyRequirements.length > 0 ? analysis.keyRequirements : [
      'Product features and benefits',
      'Licensing options',
      'Implementation support'
    ],
  };
}

function generatePricingRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  if (analysis.estimatedDealValue === 'high') {
    return {
      summary: `High-value pricing/renewal request from ${email.sender.organization}. Estimated value: significant.`,
      primaryAction: 'Generate custom quote draft with strategic pricing',
      reasoning: 'Large deal requires careful attention. Consider multi-year incentives and bundle opportunities.',
      alternatives: [
        'Schedule call with regional account director',
        'Loop in strategic accounts team',
        'Prepare competitive positioning analysis'
      ],
      talkingPoints: [
        'Multi-year pricing incentives',
        'Bundle discounts (e.g., SciVal + Scopus)',
        'Open Access transformative agreement options',
        'Added value services'
      ],
      riskFactors: [
        'Budget cycle timing',
        'Competitive alternatives being evaluated',
        'Consortium negotiation dynamics'
      ],
      timeSensitivity: analysis.urgency === 'critical' ? 'Immediate response required' : 'Respond within 48 hours',
    };
  }

  if (analysis.sentiment === 'positive') {
    return {
      summary: `Positive renewal signal from ${email.sender.organization}. Budget appears approved.`,
      primaryAction: 'Resend quote immediately and schedule closing call',
      reasoning: 'Customer is ready to proceed - minimize friction to close.',
      alternatives: [
        'Fast-track procurement paperwork',
        'Offer expedited onboarding'
      ],
      timeSensitivity: 'Respond today - deal is warm',
    };
  }

  return {
    summary: `Pricing request from ${email.sender.organization} regarding ${analysis.products.join(', ') || 'subscription'}.`,
    primaryAction: 'Forward to Renewals team with context',
    reasoning: 'Standard renewal process should handle this efficiently.',
    alternatives: [
      'Generate preliminary quote',
      'Request additional requirements'
    ],
  };
}

function generateAccessIssueRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  const isUrgent = analysis.urgency === 'critical' || analysis.urgency === 'high';
  
  return {
    summary: `Access issue reported by ${email.sender.organization}. ${isUrgent ? '⚠️ URGENT - Academic deadlines involved.' : ''}`,
    primaryAction: isUrgent ? 'Create priority support ticket and escalate' : 'Create support ticket for investigation',
    reasoning: isUrgent 
      ? 'Academic deadlines are immovable. Fast resolution protects the relationship and future renewals.'
      : 'Technical investigation needed - routing to support team.',
    alternatives: [
      'Escalate to technical account manager',
      'Provide temporary workaround if available',
      'Send acknowledgment while investigating'
    ],
    riskFactors: isUrgent ? [
      'Thesis/publication deadlines at risk',
      'Potential escalation to procurement',
      'Renewal goodwill impact'
    ] : undefined,
    timeSensitivity: isUrgent ? 'Immediate escalation required' : 'Standard support SLA',
  };
}

function generateAdminRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  const isInvoiceRequest = email.body.toLowerCase().includes('invoice');
  const isAdminAccess = email.body.toLowerCase().includes('admin') && email.body.toLowerCase().includes('access');
  
  if (isInvoiceRequest) {
    return {
      summary: `Administrative request: Invoice copy needed for ${email.sender.organization}.`,
      primaryAction: 'Auto-reply confirming invoice will be sent',
      reasoning: 'Standard admin request - can be handled automatically by Finance/Sales Ops.',
      alternatives: [
        'Delegate to Sales Ops',
        'Pull invoice from billing system'
      ],
      timeSensitivity: 'Routine - respond within 1-2 business days',
    };
  }

  if (isAdminAccess) {
    return {
      summary: `Admin portal access request from ${email.sender.organization}.`,
      primaryAction: 'Forward to Sales Ops for account provisioning',
      reasoning: 'Account provisioning follows standard security protocols.',
      alternatives: [
        'Verify requester authorization first',
        'Send access request form'
      ],
    };
  }

  return {
    summary: `Administrative request from ${email.sender.organization}.`,
    primaryAction: 'Delegate to Sales Ops',
    reasoning: 'Administrative tasks should be handled by operations team to free your selling time.',
    alternatives: [
      'Auto-reply with FAQ',
      'Forward to appropriate department'
    ],
  };
}

function generateSalesOpsRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  return {
    summary: `Internal request from ${email.sender.name} (${email.sender.organization}).`,
    primaryAction: 'Hand off to Sales Ops with deal context',
    reasoning: 'Internal operational matters should be resolved through proper channels.',
    alternatives: [
      'Respond directly if quick answer available',
      'Schedule sync with relevant stakeholders'
    ],
    timeSensitivity: 'Internal SLA - respond within 24 hours',
  };
}

function generateHighValueRecommendation(email: Email, analysis: EmailAnalysis): AgentRecommendation {
  return {
    summary: `🎯 Strategic opportunity from ${email.sender.organization}. This requires your personal attention.`,
    primaryAction: 'Review and craft personalized response',
    reasoning: 'High-value conversations drive revenue. Your expertise and relationship skills are essential here.',
    alternatives: [],
    talkingPoints: [
      'Reference previous interactions and relationship history',
      'Address strategic priorities mentioned',
      'Propose concrete next steps',
      'Offer executive-level engagement if appropriate'
    ],
    riskFactors: analysis.actionableInsights,
    timeSensitivity: 'Prioritize - respond within 4 hours',
  };
}

// Generate contextual chat responses
export function generateContextualResponse(
  input: string, 
  email: Email, 
  analysis: EmailAnalysis,
  recommendation: AgentRecommendation
): string {
  const lowerInput = input.toLowerCase();

  // Handle common queries
  if (lowerInput.includes('why') || lowerInput.includes('explain')) {
    return `Here's my reasoning:\n\n${recommendation.reasoning}\n\n${analysis.actionableInsights.length > 0 ? `Key insights:\n• ${analysis.actionableInsights.join('\n• ')}` : ''}`;
  }

  if (lowerInput.includes('alternative') || lowerInput.includes('other option')) {
    if (recommendation.alternatives.length > 0) {
      return `Here are alternative approaches:\n\n${recommendation.alternatives.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nWould you like me to proceed with any of these?`;
    }
    return 'The primary action I recommended is the best approach for this situation.';
  }

  if (lowerInput.includes('talking point') || lowerInput.includes('what should i say')) {
    if (recommendation.talkingPoints && recommendation.talkingPoints.length > 0) {
      return `Key talking points for ${email.sender.name}:\n\n${recommendation.talkingPoints.map(tp => `• ${tp}`).join('\n')}`;
    }
    return `Focus on addressing their specific questions about ${analysis.products.join(', ') || 'the product'} and emphasize the value proposition for ${email.sender.organization}.`;
  }

  if (lowerInput.includes('risk') || lowerInput.includes('concern')) {
    if (recommendation.riskFactors && recommendation.riskFactors.length > 0) {
      return `Potential risks to consider:\n\n${recommendation.riskFactors.map(rf => `⚠️ ${rf}`).join('\n')}`;
    }
    return 'I don\'t see significant risks with this request, but always consider the customer relationship context.';
  }

  if (lowerInput.includes('customer') || lowerInput.includes('account') || lowerInput.includes('history')) {
    return `Account summary for ${email.sender.organization}:\n\n• Customer type: ${analysis.customerType.charAt(0).toUpperCase() + analysis.customerType.slice(1)}\n• Products mentioned: ${analysis.products.join(', ') || 'None specified'}\n• Decision-maker: ${analysis.decisionMaker ? 'Yes' : 'Unknown'}\n• Current sentiment: ${analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}\n• Deal value estimate: ${analysis.estimatedDealValue.charAt(0).toUpperCase() + analysis.estimatedDealValue.slice(1)}`;
  }

  if (lowerInput.includes('yes') || lowerInput.includes('proceed') || lowerInput.includes('do it')) {
    return `Great! I'm executing: "${recommendation.primaryAction}"\n\n✓ Action completed. ${recommendation.timeSensitivity ? `Note: ${recommendation.timeSensitivity}` : ''}`;
  }

  if (lowerInput.includes('draft') || lowerInput.includes('write') || lowerInput.includes('compose')) {
    return `I'll draft a response for ${email.sender.name}. Here's a starting point:\n\n---\nDear ${email.sender.name.split(' ')[0]},\n\nThank you for reaching out regarding ${analysis.products[0] || 'your inquiry'}.\n\n${recommendation.talkingPoints ? recommendation.talkingPoints[0] + '\n\n' : ''}I'd be happy to ${recommendation.primaryAction.toLowerCase()}. Let me know if you have any questions.\n\nBest regards`;
  }

  if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
    return `I can help you with:\n\n• Analyze this email's context and requirements\n• Explain my recommendation reasoning\n• Suggest talking points for your response\n• Identify risks or concerns\n• Draft a response\n• Pull account information\n• Execute routine actions\n\nJust ask!`;
  }

  // Default contextual response
  return `Based on my analysis of this ${analysis.customerType} email from ${email.sender.organization}, I recommend: ${recommendation.primaryAction}.\n\n${analysis.urgency === 'critical' || analysis.urgency === 'high' ? '⏰ This appears time-sensitive.' : ''} Would you like me to proceed or would you prefer an alternative approach?`;
}
