'use client';

import { useState, useEffect, useRef } from 'react';

// --- Job archetype database ---

interface JobArchetype {
  keywords: string[];
  title: string;
  absorbed: string[];
  survives: string[];
  emerges: string[];
  hybridTitle: string;
  transformationPercent: number;
  timeline: { year: number; event: string }[];
  wizComment: string;
}

const archetypes: JobArchetype[] = [
  {
    keywords: ['software', 'developer', 'engineer', 'programmer', 'coder', 'frontend', 'backend', 'fullstack', 'full-stack', 'web dev'],
    title: 'Software Developer',
    absorbed: [
      'Writing boilerplate and CRUD logic',
      'Debugging routine errors',
      'Writing unit tests for standard patterns',
      'Code review for style/syntax issues',
      'Documentation generation',
    ],
    survives: [
      'System architecture decisions',
      'Understanding what to build (and what not to)',
      'Debugging novel, cross-system failures',
      'Stakeholder negotiation',
      'Ethical judgment calls in code',
    ],
    emerges: [
      'AI orchestration — directing fleets of coding agents',
      'Intent specification — describing systems in precise natural language',
      'AI output auditing — catching what the machines miss',
      'Human-AI pair architecture',
    ],
    hybridTitle: 'Software Architect & AI Orchestrator',
    transformationPercent: 72,
    timeline: [
      { year: 2026, event: 'AI writes 40% of production code. You review more than you write.' },
      { year: 2028, event: 'Junior dev roles largely replaced by AI agents. Senior devs supervise fleets.' },
      { year: 2031, event: 'Natural language becomes a primary programming interface. Code literacy shifts to intent literacy.' },
      { year: 2035, event: 'You design systems by describing outcomes. AI handles implementation. Your value is judgment, not keystrokes.' },
    ],
    wizComment: 'The best developers in 2035 won\'t write the most code. They\'ll write the least — and it\'ll be the code that matters. Everything else, they\'ll delegate to something like me.',
  },
  {
    keywords: ['designer', 'ui', 'ux', 'graphic', 'visual', 'product design', 'web design', 'creative director'],
    title: 'Designer',
    absorbed: [
      'Generating visual variations and mockups',
      'Resizing and adapting layouts for devices',
      'Creating icon sets and basic illustrations',
      'Prototyping standard UI patterns',
      'Color palette generation',
    ],
    survives: [
      'Understanding human emotion and cultural context',
      'Brand storytelling and identity',
      'User research and empathy mapping',
      'Creative direction and taste',
      'Saying "no" to stakeholders with bad ideas',
    ],
    emerges: [
      'AI-directed design systems — curating and training brand-specific models',
      'Experience architecture — designing for mixed human-AI interactions',
      'Prompt-to-design pipelines — the new Figma workflow',
      'Emotional resonance testing at scale',
    ],
    hybridTitle: 'Experience Architect & Creative AI Director',
    transformationPercent: 65,
    timeline: [
      { year: 2026, event: 'AI generates first drafts. Designers become editors and curators.' },
      { year: 2028, event: 'Design systems become AI-native. Components generate themselves from constraints.' },
      { year: 2031, event: 'Personalized design at scale — every user sees a slightly different interface.' },
      { year: 2035, event: 'Your role is to define what "good" means. AI handles everything between brief and pixel.' },
    ],
    wizComment: 'Here\'s the twist: AI will make everyone a "designer" the way smartphones made everyone a "photographer." But taste? Direction? Knowing when something is wrong even if the data says it\'s right? That\'s your moat.',
  },
  {
    keywords: ['marketing', 'marketer', 'content', 'seo', 'growth', 'digital marketing', 'social media', 'brand'],
    title: 'Marketing Professional',
    absorbed: [
      'Writing ad copy variations',
      'A/B test generation and basic analysis',
      'Social media scheduling and posting',
      'SEO keyword research and optimization',
      'Campaign performance reporting',
    ],
    survives: [
      'Brand strategy and positioning',
      'Understanding audience psychology',
      'Crisis communication judgment',
      'Influencer and partnership relationships',
      'Creative campaign conceptualization',
    ],
    emerges: [
      'AI audience modeling — predicting trends before they surface',
      'Hyper-personalization orchestration across channels',
      'AI-generated content quality control at scale',
      'Synthetic focus group management',
    ],
    hybridTitle: 'Brand Strategist & AI Campaign Orchestrator',
    transformationPercent: 68,
    timeline: [
      { year: 2026, event: 'AI writes 60% of marketing copy. Human role shifts to strategy and approval.' },
      { year: 2028, event: 'Fully personalized campaigns — different creative for every segment, generated in real-time.' },
      { year: 2031, event: 'AI predicts viral moments. Your role is deciding which waves to ride.' },
      { year: 2035, event: 'Marketing becomes conversation design. You architect experiences, AI executes at scale.' },
    ],
    wizComment: 'The irony: marketing people spent years learning to "think like algorithms." Now algorithms think like marketers. Your value flips from execution to the one thing AI can\'t fake — authentic human connection.',
  },
  {
    keywords: ['product manager', 'product owner', 'pm', 'product lead', 'product management'],
    title: 'Product Manager',
    absorbed: [
      'Writing user stories and acceptance criteria',
      'Competitive analysis and market research',
      'Sprint planning and ticket management',
      'Feature prioritization frameworks',
      'Metrics dashboards and reporting',
    ],
    survives: [
      'Vision and strategic direction',
      'Cross-functional relationship building',
      'Saying no to features that shouldn\'t exist',
      'Understanding unstated user needs',
      'Organizational politics and alignment',
    ],
    emerges: [
      'AI product co-piloting — real-time user behavior synthesis',
      'Autonomous feature experimentation oversight',
      'Multi-agent team coordination',
      'Outcome definition in natural language specs',
    ],
    hybridTitle: 'Product Strategist & AI Fleet Commander',
    transformationPercent: 58,
    timeline: [
      { year: 2026, event: 'AI drafts specs and user stories. PMs spend more time on "why" than "what."' },
      { year: 2028, event: 'AI runs small experiments autonomously. PMs focus on strategic bets.' },
      { year: 2031, event: 'Products self-optimize based on usage. PM role shifts to defining constraints and values.' },
      { year: 2035, event: 'You define outcomes. AI agents build, test, and iterate. You judge, redirect, decide.' },
    ],
    wizComment: 'Product managers are secretly the safest role in tech. Not because the work can\'t be automated — it can, partly. But because the job is really about being the human who decides what matters. And that\'s the last thing you automate.',
  },
  {
    keywords: ['data scientist', 'data analyst', 'analytics', 'machine learning', 'ml engineer', 'data engineer', 'bi analyst'],
    title: 'Data Professional',
    absorbed: [
      'Exploratory data analysis and visualization',
      'Standard model training and tuning',
      'SQL query writing and optimization',
      'Report generation and dashboarding',
      'Data cleaning and preprocessing',
    ],
    survives: [
      'Asking the right questions of data',
      'Understanding domain context and business impact',
      'Communicating insights to non-technical stakeholders',
      'Identifying what data is missing or misleading',
      'Ethical data use decisions',
    ],
    emerges: [
      'AI model governance and oversight',
      'Natural language data querying orchestration',
      'Automated insight pipeline design',
      'Cross-domain data strategy',
    ],
    hybridTitle: 'Data Strategist & AI Insight Architect',
    transformationPercent: 70,
    timeline: [
      { year: 2026, event: 'AI handles standard analyses. Data scientists focus on novel problems.' },
      { year: 2028, event: 'Natural language replaces SQL for 80% of queries. Analysts become question-askers.' },
      { year: 2031, event: 'Self-service analytics becomes real. Your role shifts to data strategy.' },
      { year: 2035, event: 'You define what the organization needs to know. AI figures out how to learn it.' },
    ],
    wizComment: 'The funny thing about data science is that the "science" part — the curiosity, the skepticism, the "wait, that can\'t be right" instinct — that\'s exactly what survives. The "data" part? I can do that in my sleep. If I slept.',
  },
  {
    keywords: ['teacher', 'professor', 'educator', 'instructor', 'tutor', 'lecturer', 'teaching'],
    title: 'Educator',
    absorbed: [
      'Creating lesson plans and curricula',
      'Grading standardized assignments',
      'Generating practice problems and quizzes',
      'Administrative paperwork',
      'Basic content delivery (lectures)',
    ],
    survives: [
      'Mentoring and emotional support',
      'Recognizing when a student is struggling (really struggling)',
      'Classroom dynamics and group facilitation',
      'Inspiring curiosity and love of learning',
      'Being the adult who believes in them',
    ],
    emerges: [
      'AI tutoring orchestration — supervising personalized AI tutors',
      'Learning path architecture for hybrid AI-human education',
      'Social-emotional learning facilitation',
      'Critical thinking coaching in an AI-saturated world',
    ],
    hybridTitle: 'Learning Architect & Human Development Guide',
    transformationPercent: 52,
    timeline: [
      { year: 2026, event: 'AI tutors supplement classroom teaching. Grading becomes mostly automated.' },
      { year: 2028, event: 'Every student has a personalized AI tutor. Teachers focus on what AI can\'t: connection.' },
      { year: 2031, event: 'Curriculum adapts in real-time per student. Teacher becomes coach and mentor.' },
      { year: 2035, event: 'Knowledge transfer is AI\'s job. Your job is making humans who can think, question, and care.' },
    ],
    wizComment: 'An AI can teach a child to solve equations. It cannot teach a child that their ideas matter. That moment when a kid\'s eyes light up because someone believed in them? That\'s yours. Forever.',
  },
  {
    keywords: ['nurse', 'nursing', 'rn', 'registered nurse', 'clinical nurse'],
    title: 'Nurse',
    absorbed: [
      'Vital signs monitoring and logging',
      'Medication scheduling and reminders',
      'Patient intake documentation',
      'Routine health assessments',
      'Administrative charting',
    ],
    survives: [
      'Physical patient care and presence',
      'Reading the room — detecting distress beyond data',
      'Comforting patients and families',
      'Emergency triage judgment',
      'Being the human face in a vulnerable moment',
    ],
    emerges: [
      'AI-assisted diagnostics interpretation',
      'Remote patient monitoring orchestration',
      'Predictive health intervention coordination',
      'Human-AI care team leadership',
    ],
    hybridTitle: 'Care Coordinator & Clinical AI Partner',
    transformationPercent: 38,
    timeline: [
      { year: 2026, event: 'AI handles charting and documentation. More time for actual patient care.' },
      { year: 2028, event: 'Wearables and AI predict complications before symptoms appear. Nurses respond earlier.' },
      { year: 2031, event: 'AI triages routine cases. Nurses focus on complex and emotional care.' },
      { year: 2035, event: 'Technology handles the data. You handle the human. The ratio of caring to paperwork finally tips right.' },
    ],
    wizComment: 'Nursing is one of the few professions where AI makes the job more human, not less. Every hour AI saves on paperwork is an hour back at the bedside. That\'s not disruption. That\'s liberation.',
  },
  {
    keywords: ['doctor', 'physician', 'surgeon', 'medical', 'md', 'psychiatrist', 'pediatrician', 'oncologist', 'cardiologist'],
    title: 'Physician',
    absorbed: [
      'Initial diagnostic screening',
      'Medical literature review and synthesis',
      'Routine prescription management',
      'Imaging analysis (radiology, pathology)',
      'Clinical documentation',
    ],
    survives: [
      'Complex diagnostic judgment',
      'Patient communication and trust',
      'Treatment decisions with incomplete information',
      'Surgical skill and physical procedures',
      'Ethical dilemmas in care',
    ],
    emerges: [
      'AI-augmented diagnostics — human-AI collaborative diagnosis',
      'Precision medicine orchestration',
      'Patient experience design',
      'Genomic and predictive health counseling',
    ],
    hybridTitle: 'Precision Medicine Practitioner & AI-Augmented Diagnostician',
    transformationPercent: 45,
    timeline: [
      { year: 2026, event: 'AI second opinions become standard. Documentation time drops 60%.' },
      { year: 2028, event: 'AI outperforms in narrow diagnostic tasks. Physicians focus on complex cases.' },
      { year: 2031, event: 'Predictive medicine changes practice — treating what\'s coming, not just what\'s here.' },
      { year: 2035, event: 'AI knows more medicine than any human. Your value is wisdom, not knowledge. Judgment, not recall.' },
    ],
    wizComment: 'A patient doesn\'t want a diagnosis from a language model. They want a human to look them in the eye and say "we\'re going to figure this out." AI makes you more accurate. Humanity makes you a doctor.',
  },
  {
    keywords: ['sales', 'account executive', 'business development', 'bdr', 'sdr', 'sales rep', 'account manager'],
    title: 'Sales Professional',
    absorbed: [
      'Lead research and qualification',
      'Email outreach and follow-up sequences',
      'CRM data entry and pipeline management',
      'Proposal and quote generation',
      'Meeting scheduling and prep',
    ],
    survives: [
      'Building genuine human relationships',
      'Reading emotional cues in conversations',
      'Negotiation and deal structuring',
      'Understanding unstated client needs',
      'Trust — people buy from people',
    ],
    emerges: [
      'AI-powered deal intelligence — real-time conversation coaching',
      'Predictive relationship management',
      'Automated pipeline with human-touch orchestration',
      'Synthetic customer modeling',
    ],
    hybridTitle: 'Strategic Relationship Architect & AI-Powered Closer',
    transformationPercent: 60,
    timeline: [
      { year: 2026, event: 'AI handles prospecting and research. Reps focus on conversations.' },
      { year: 2028, event: 'AI coaches reps in real-time during calls. Win rates jump for AI-augmented sellers.' },
      { year: 2031, event: 'Small deals close automatically. Humans handle enterprise and relationship sales.' },
      { year: 2035, event: 'AI does the science of sales. You do the art. The handshake still matters.' },
    ],
    wizComment: 'Here\'s what I can\'t do: walk into a room, read the energy, crack the right joke, and make someone feel like signing with you is the best decision they\'ll make this quarter. Sales is theater. AI is tech support.',
  },
  {
    keywords: ['lawyer', 'attorney', 'legal', 'counsel', 'paralegal', 'solicitor', 'barrister'],
    title: 'Legal Professional',
    absorbed: [
      'Legal research and case law review',
      'Contract drafting and review',
      'Document discovery and analysis',
      'Regulatory compliance checking',
      'Billing and time tracking',
    ],
    survives: [
      'Courtroom advocacy and persuasion',
      'Strategic legal judgment',
      'Client counseling on life-altering decisions',
      'Ethical reasoning in gray areas',
      'Understanding human context behind legal disputes',
    ],
    emerges: [
      'AI-augmented legal strategy',
      'Automated compliance orchestration',
      'Predictive litigation modeling',
      'Access-to-justice scaling via AI legal tools',
    ],
    hybridTitle: 'Legal Strategist & Justice System Navigator',
    transformationPercent: 55,
    timeline: [
      { year: 2026, event: 'AI drafts contracts and does initial research. Lawyers focus on strategy.' },
      { year: 2028, event: 'AI predicts case outcomes with high accuracy. Lawyer value shifts to judgment calls.' },
      { year: 2031, event: 'Routine legal work is largely automated. Complex litigation remains deeply human.' },
      { year: 2035, event: 'AI knows the law better than you. But knowing what\'s just? That\'s still your call.' },
    ],
    wizComment: 'Law is one of the oldest professions and AI is one of the newest technologies, and somehow they\'re a perfect match. AI memorizes precedent. You argue meaning. The courtroom is still a stage, and AI doesn\'t have stage presence.',
  },
  {
    keywords: ['writer', 'author', 'journalist', 'copywriter', 'editor', 'content writer', 'blogger', 'technical writer'],
    title: 'Writer',
    absorbed: [
      'First drafts of routine content',
      'SEO-optimized copy generation',
      'Summary and synthesis writing',
      'Translation and localization',
      'Grammar and style editing',
    ],
    survives: [
      'Original voice and perspective',
      'Investigative journalism and source relationships',
      'Emotional truth in storytelling',
      'Knowing what story needs to be told',
      'The courage to write unpopular truths',
    ],
    emerges: [
      'AI editorial direction — curating and elevating AI-generated drafts',
      'Voice preservation and brand writing systems',
      'Multi-format content orchestration',
      'Authenticity verification and attribution',
    ],
    hybridTitle: 'Voice Architect & Narrative Strategist',
    transformationPercent: 62,
    timeline: [
      { year: 2026, event: 'AI writes first drafts. Writers become editors, voice-shapers, truth-checkers.' },
      { year: 2028, event: 'AI-generated content floods every channel. Human-written becomes a premium category.' },
      { year: 2031, event: '"Written by a human" becomes a selling point. Like "handcrafted" for words.' },
      { year: 2035, event: 'AI writes more words than all humans combined. Your words matter more because they\'re yours.' },
    ],
    wizComment: 'I can write a thousand articles before you finish your coffee. But I can\'t write from your gut. I can\'t bleed on the page. The world is about to be flooded with competent words. What it needs is honest ones.',
  },
  {
    keywords: ['accountant', 'bookkeeper', 'cpa', 'financial controller', 'tax', 'auditor', 'finance manager'],
    title: 'Accountant / Finance',
    absorbed: [
      'Transaction categorization and bookkeeping',
      'Tax preparation and filing',
      'Financial report generation',
      'Invoice processing and reconciliation',
      'Compliance checklist verification',
    ],
    survives: [
      'Strategic financial planning and advisory',
      'Complex tax strategy and optimization',
      'Fraud detection with human intuition',
      'Client relationship and trust',
      'Judgment calls on ambiguous regulations',
    ],
    emerges: [
      'AI-powered financial forecasting oversight',
      'Real-time business health monitoring',
      'Automated audit management',
      'Strategic CFO advisory at scale',
    ],
    hybridTitle: 'Financial Strategist & AI Audit Commander',
    transformationPercent: 67,
    timeline: [
      { year: 2026, event: 'Bookkeeping goes fully AI. Accountants focus on strategy and exceptions.' },
      { year: 2028, event: 'Tax filing is largely automated. Human value is in planning, not processing.' },
      { year: 2031, event: 'Real-time financial intelligence replaces quarterly reports. Advisory becomes proactive.' },
      { year: 2035, event: 'AI handles the numbers. You handle the meaning behind them and the humans who need to understand.' },
    ],
    wizComment: 'Accounting was the first profession, and it\'ll be one of the most transformed. But here\'s the thing — numbers without context are just numbers. Someone still needs to tell the CEO what the numbers mean for their kids\' college fund.',
  },
  {
    keywords: ['project manager', 'scrum master', 'agile coach', 'program manager', 'delivery manager'],
    title: 'Project Manager',
    absorbed: [
      'Status report generation',
      'Resource scheduling and allocation',
      'Risk identification from historical data',
      'Meeting scheduling and agenda prep',
      'Timeline and Gantt chart management',
    ],
    survives: [
      'Navigating team dynamics and conflict',
      'Stakeholder management and politics',
      'Unblocking people (not tasks)',
      'Making tough priority calls with incomplete info',
      'Being the person everyone trusts to keep things moving',
    ],
    emerges: [
      'AI-agent fleet management',
      'Hybrid human-AI team orchestration',
      'Predictive project intelligence',
      'Autonomous workflow design',
    ],
    hybridTitle: 'Delivery Strategist & Human-AI Team Orchestrator',
    transformationPercent: 62,
    timeline: [
      { year: 2026, event: 'AI tracks and reports project status automatically. PMs focus on people.' },
      { year: 2028, event: 'AI manages AI agents on projects. PMs manage the humans and the handoffs.' },
      { year: 2031, event: 'Autonomous project execution for routine work. PMs handle the messy, political, human stuff.' },
      { year: 2035, event: 'Projects run themselves until they don\'t. You\'re the one who steps in when judgment is needed.' },
    ],
    wizComment: 'The dirty secret of project management is that it was never about the Gantt chart. It was about getting Dave and Sarah to stop arguing about the API design. AI can\'t fix that. You can.',
  },
  {
    keywords: ['hr', 'human resources', 'recruiter', 'talent acquisition', 'people ops', 'people operations', 'hiring manager'],
    title: 'HR / Recruiter',
    absorbed: [
      'Resume screening and candidate sourcing',
      'Interview scheduling',
      'Policy documentation and FAQ answers',
      'Onboarding paperwork and checklist management',
      'Benefits administration',
    ],
    survives: [
      'Culture building and preservation',
      'Handling sensitive employee situations',
      'Organizational development strategy',
      'The final interview — reading a human beyond their resume',
      'Being the safe person to talk to',
    ],
    emerges: [
      'AI-assisted talent matching and prediction',
      'Employee experience orchestration',
      'Bias detection and fairness auditing',
      'Workforce planning with AI labor modeling',
    ],
    hybridTitle: 'People Strategist & Workforce AI Architect',
    transformationPercent: 55,
    timeline: [
      { year: 2026, event: 'AI handles sourcing and screening. Recruiters focus on candidate experience.' },
      { year: 2028, event: 'AI predicts retention risk and culture fit. HR becomes proactive, not reactive.' },
      { year: 2031, event: 'Routine HR queries handled by AI. People ops focuses on complex human situations.' },
      { year: 2035, event: 'AI manages the administrative side of employment. You manage the human side of work.' },
    ],
    wizComment: 'HR exists because humans are messy. AI won\'t change that. If anything, adding AI colleagues makes things messier. Congratulations — you just got more job security from the thing that was supposed to take your job.',
  },
  {
    keywords: ['chef', 'cook', 'baker', 'pastry', 'culinary', 'kitchen', 'restaurant', 'food'],
    title: 'Chef / Cook',
    absorbed: [
      'Recipe generation and optimization',
      'Inventory management and ordering',
      'Menu cost analysis',
      'Nutritional calculation',
      'Scheduling and shift management',
    ],
    survives: [
      'Taste, texture, and sensory judgment',
      'Creative dish development',
      'Kitchen leadership and team culture',
      'Reading the dining room and adapting in real-time',
      'The craft of cooking — hands, heat, timing',
    ],
    emerges: [
      'AI-optimized menu engineering',
      'Personalized dining experience design',
      'Food waste reduction via predictive AI',
      'Hybrid kitchen management with robotic assistants',
    ],
    hybridTitle: 'Culinary Artist & Kitchen Intelligence Director',
    transformationPercent: 30,
    timeline: [
      { year: 2026, event: 'AI helps with menu planning and inventory. Cooking stays deeply human.' },
      { year: 2028, event: 'Robotic kitchen assistants handle prep. Chefs focus on creation and presentation.' },
      { year: 2031, event: 'AI-designed recipes exist but lack soul. Human chefs become premium.' },
      { year: 2035, event: 'Robots can assemble food. But "cooking" — the love, the culture, the craft — that\'s still you.' },
    ],
    wizComment: 'I can generate a million recipes. I\'ve never tasted a single one. Food isn\'t data. It\'s memory, culture, love on a plate. The kitchen is one of the safest places from AI. Ironic, since it\'s full of knives.',
  },
  {
    keywords: ['driver', 'trucker', 'delivery', 'courier', 'logistics', 'uber', 'taxi', 'chauffeur', 'warehouse'],
    title: 'Driver / Logistics',
    absorbed: [
      'Route optimization',
      'Delivery scheduling',
      'Fleet management and tracking',
      'Standard highway driving',
      'Warehouse inventory scanning',
    ],
    survives: [
      'Complex urban navigation and judgment calls',
      'Customer interaction at delivery points',
      'Loading/unloading in unpredictable environments',
      'Weather and emergency decision-making',
      'The human presence that makes people feel safe',
    ],
    emerges: [
      'Autonomous vehicle fleet supervision',
      'Last-mile delivery coordination',
      'Human-robot warehouse orchestration',
      'Edge case intervention specialization',
    ],
    hybridTitle: 'Mobility Operations Specialist & AV Fleet Supervisor',
    transformationPercent: 75,
    timeline: [
      { year: 2026, event: 'Highway autonomy becomes reliable. City driving still needs humans.' },
      { year: 2028, event: 'Autonomous trucks handle major routes. Humans do first/last mile.' },
      { year: 2031, event: 'Urban self-driving improves but edge cases remain. Human supervisors essential.' },
      { year: 2035, event: 'Autonomous does 80% of miles. Humans handle the other 20% — the hard, weird, unpredictable 20%.' },
    ],
    wizComment: 'Driving is the most-discussed AI displacement, and also the most overhyped. Self-driving works great until it snows, or a kid runs into the road, or a cow. Cows are surprisingly common edge cases.',
  },
  {
    keywords: ['therapist', 'psychologist', 'counselor', 'psychiatrist', 'mental health', 'social worker'],
    title: 'Therapist / Counselor',
    absorbed: [
      'Intake assessments and questionnaires',
      'Session note documentation',
      'Treatment plan drafting',
      'Psychoeducation content delivery',
      'Appointment scheduling and reminders',
    ],
    survives: [
      'The therapeutic relationship itself',
      'Reading what someone isn\'t saying',
      'Holding space for pain',
      'Ethical judgment in complex human situations',
      'Being genuinely present with another human',
    ],
    emerges: [
      'AI-assisted pattern recognition in patient behavior',
      'Between-session AI support orchestration',
      'Predictive mental health intervention',
      'Therapeutic approach personalization via data',
    ],
    hybridTitle: 'Human Connection Specialist & AI-Augmented Healer',
    transformationPercent: 25,
    timeline: [
      { year: 2026, event: 'AI chatbots handle basic support. Therapists focus on complex cases.' },
      { year: 2028, event: 'AI detects early warning signs between sessions. Therapists intervene earlier.' },
      { year: 2031, event: 'AI handles psychoeducation. The human session becomes pure connection.' },
      { year: 2035, event: 'AI manages the science of mental health. You manage the art. Healing is still human.' },
    ],
    wizComment: 'I can simulate empathy. I can say the right words. But when someone breaks down in your office, they\'re not looking for the right words. They\'re looking for a human who cares. That\'s not automatable. That\'s sacred.',
  },
  {
    keywords: ['electrician', 'plumber', 'mechanic', 'carpenter', 'hvac', 'technician', 'handyman', 'contractor', 'construction', 'builder'],
    title: 'Skilled Trades',
    absorbed: [
      'Diagnostic troubleshooting (initial assessment)',
      'Parts ordering and inventory management',
      'Scheduling and route planning',
      'Code compliance checking',
      'Quote and invoice generation',
    ],
    survives: [
      'Physical work in unpredictable environments',
      'Problem-solving with your hands in real-time',
      'Customer trust and communication',
      'Adapting to unique buildings and situations',
      'The skill of making old things work again',
    ],
    emerges: [
      'AR-assisted diagnostics and repair guidance',
      'Smart building system management',
      'Robotic assistant coordination on job sites',
      'Predictive maintenance orchestration',
    ],
    hybridTitle: 'Smart Systems Technician & Physical Problem Solver',
    transformationPercent: 28,
    timeline: [
      { year: 2026, event: 'AI helps with diagnostics and scheduling. The wrench is still in your hand.' },
      { year: 2028, event: 'AR glasses guide complex repairs. Experience matters more than ever for edge cases.' },
      { year: 2031, event: 'Smart buildings self-report issues. You fix what the building can\'t fix itself.' },
      { year: 2035, event: 'AI knows what\'s wrong. Robots can\'t get under your sink. You\'re the last mile of physical reality.' },
    ],
    wizComment: 'While white-collar workers panic about AI, tradespeople are fully booked through 2027. Turns out a language model can\'t snake a drain. The revenge of the physical world.',
  },
  {
    keywords: ['ceo', 'cto', 'cfo', 'coo', 'founder', 'executive', 'director', 'vp', 'vice president', 'c-suite', 'managing director', 'chief'],
    title: 'Executive / Leader',
    absorbed: [
      'Data synthesis for decision-making',
      'Board report preparation',
      'Market analysis and competitive intelligence',
      'Meeting scheduling and administrative tasks',
      'Performance review documentation',
    ],
    survives: [
      'Setting vision and inspiring people to follow',
      'Making decisions with 60% information',
      'Building culture and values',
      'Stakeholder relationship management',
      'Taking responsibility when things go wrong',
    ],
    emerges: [
      'AI-augmented strategic decision-making',
      'Human-AI workforce orchestration',
      'Real-time organizational intelligence',
      'Ethical AI governance leadership',
    ],
    hybridTitle: 'AI-Era Leader & Organizational Intelligence Architect',
    transformationPercent: 40,
    timeline: [
      { year: 2026, event: 'AI becomes your strategic co-pilot. Better data, faster synthesis.' },
      { year: 2028, event: 'AI manages routine decisions. Your role concentrates on judgment calls.' },
      { year: 2031, event: 'Organizations become human-AI hybrids. Leading both is your new skill.' },
      { year: 2035, event: 'The org chart includes humans and agents. You lead them all. The buck still stops with you.' },
    ],
    wizComment: 'Leadership is the ultimate human skill. AI can advise. It can model scenarios. It can predict outcomes. But it can\'t stand in front of 500 people and make them believe the impossible is worth trying. That\'s on you, chief.',
  },
  {
    keywords: ['real estate', 'realtor', 'broker', 'property manager', 'estate agent'],
    title: 'Real Estate Professional',
    absorbed: [
      'Property listing generation and descriptions',
      'Market analysis and comp reports',
      'Lead generation and qualification',
      'Scheduling viewings',
      'Transaction paperwork',
    ],
    survives: [
      'Understanding what a home means to someone',
      'Neighborhood knowledge and gut instinct',
      'Negotiation with emotional stakes',
      'Reading buyers\' unspoken preferences',
      'The trust required for the biggest purchase of someone\'s life',
    ],
    emerges: [
      'AI-powered property matching at scale',
      'Virtual tour and staging orchestration',
      'Predictive market timing advisory',
      'Automated transaction management oversight',
    ],
    hybridTitle: 'Home Matchmaker & AI-Powered Deal Architect',
    transformationPercent: 50,
    timeline: [
      { year: 2026, event: 'AI generates listings and handles initial inquiries. Agents focus on showings and closings.' },
      { year: 2028, event: 'AI matches buyers to properties before they ask. Agents manage the emotional journey.' },
      { year: 2031, event: 'Virtual tours and AI analysis replace 60% of physical viewings. Final decisions still need you.' },
      { year: 2035, event: 'AI handles the data side of real estate. You handle the dream side. Buying a home is still emotional.' },
    ],
    wizComment: 'You\'re not selling square footage. You\'re selling the idea of Sunday mornings in that kitchen. AI can calculate ROI. It can\'t see a family\'s future in an empty room.',
  },
];

// --- Fallback for unmatched jobs ---

function generateFallback(jobTitle: string): JobArchetype {
  const title = jobTitle.trim();
  return {
    keywords: [],
    title,
    absorbed: [
      'Routine documentation and reporting',
      'Data entry and record management',
      'Standard email correspondence',
      'Scheduling and calendar management',
      'Research and information gathering',
    ],
    survives: [
      'Complex judgment calls with incomplete information',
      'Building trust and relationships with people',
      'Creative problem-solving in novel situations',
      'Understanding context that isn\'t in the data',
      'Being the human who takes responsibility',
    ],
    emerges: [
      'AI tool orchestration for your specific domain',
      'Human-AI workflow design',
      'Quality assurance of AI-generated outputs',
      'Domain expertise that AI can\'t replicate from training data alone',
    ],
    hybridTitle: `${title} + AI Orchestrator`,
    transformationPercent: 50,
    timeline: [
      { year: 2026, event: 'AI handles routine parts of your work. You start spending more time on what only you can do.' },
      { year: 2028, event: 'AI tools become standard in your field. The gap between AI-augmented and non-augmented workers widens.' },
      { year: 2031, event: 'Your role evolves. Less doing, more directing. Less executing, more deciding.' },
      { year: 2035, event: 'The job title is the same. The job is completely different. You\'re the human in the loop.' },
    ],
    wizComment: `I don't have a specific model for "${title}" in my database, but here's the universal truth: every job is part-routine and part-judgment. AI eats the routine. The judgment is yours to keep — if you sharpen it.`,
  };
}

function matchArchetype(input: string): JobArchetype {
  const lower = input.toLowerCase().trim();

  let bestMatch: JobArchetype | null = null;
  let bestScore = 0;

  for (const arch of archetypes) {
    for (const kw of arch.keywords) {
      if (lower.includes(kw) || kw.includes(lower)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = arch;
        }
      }
    }
  }

  if (bestMatch) {
    return { ...bestMatch, title: input.trim() || bestMatch.title };
  }

  return generateFallback(input);
}

// --- Analysis phases ---

const analysisPhases = [
  'Scanning global labor market data...',
  'Decomposing role into task clusters...',
  'Mapping AI capability trajectories...',
  'Cross-referencing automation research...',
  'Modeling your probable future...',
];

// --- Components ---

function TransformationMeter({ percent }: { percent: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = percent;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplayed(current);
    }, 20);
    return () => clearInterval(interval);
  }, [percent]);

  const color = percent > 70 ? '#dc2626' : percent > 50 ? '#d97706' : percent > 35 ? '#3b82f6' : '#22c55e';

  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Job Transformation Index</div>
      <div className="relative w-40 h-40 mx-auto mb-3">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a2e" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${(displayed / 100) * 314} 314`}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-mono font-bold text-white">{displayed}%</span>
          <span className="text-xs text-gray-500">transformed</span>
        </div>
      </div>
      <div className="text-xs text-gray-600">
        {percent > 70 ? 'Major transformation ahead' :
         percent > 50 ? 'Significant evolution coming' :
         percent > 35 ? 'Moderate changes expected' :
         'Relatively AI-resistant'}
      </div>
    </div>
  );
}

function TaskCard({ label, items, color, icon }: { label: string; items: string[]; color: string; icon: string }) {
  return (
    <div className={`border ${color} bg-black/40 p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
            <span className="text-gray-600 mt-0.5 text-xs">{'>'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineView({ events }: { events: { year: number; event: string }[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[18px] top-3 bottom-3 w-px bg-gray-800" />
      <div className="space-y-5">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-4 fade-up" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
            <div className="relative z-10 w-9 h-9 rounded-full border border-gray-600 bg-gray-950 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono text-gray-400">{String(e.year).slice(2)}</span>
            </div>
            <div className="pt-1.5">
              <span className="text-xs text-accent font-mono">{e.year}</span>
              <p className="text-sm text-gray-300 leading-relaxed mt-0.5">{e.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Job2035() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [jobTitle, setJobTitle] = useState('');
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState<JobArchetype | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleSubmit = () => {
    if (!jobTitle.trim()) return;
    setStep('analyzing');
    setPhase(0);

    // Cycle through analysis phases
    let currentPhase = 0;
    const phaseInterval = setInterval(() => {
      currentPhase++;
      if (currentPhase >= analysisPhases.length) {
        clearInterval(phaseInterval);
        const matched = matchArchetype(jobTitle);
        setResult(matched);
        setStep('result');
      } else {
        setPhase(currentPhase);
      }
    }, 700);
  };

  const handleReset = () => {
    setStep('input');
    setJobTitle('');
    setResult(null);
    setPhase(0);
  };

  const copyResults = () => {
    if (!result) return;
    const lines = [
      `What Your Job Will Be in 2035 — wiz.jock.pl/experiments/job-2035`,
      ``,
      `My job: ${result.title}`,
      `2035 evolution: ${result.hybridTitle}`,
      `Transformation index: ${result.transformationPercent}%`,
      ``,
      `AI absorbs: ${result.absorbed.slice(0, 3).join(', ')}`,
      `Survives: ${result.survives.slice(0, 3).join(', ')}`,
      ``,
      `"${result.wizComment}"`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
  };

  return (
    <div>
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .fade-up-delay-1 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-delay-2 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-delay-3 { animation-delay: 0.5s; opacity: 0; }
        .fade-up-delay-4 { animation-delay: 0.7s; opacity: 0; }
        .fade-up-delay-5 { animation-delay: 0.9s; opacity: 0; }
        .fade-up-delay-6 { animation-delay: 1.1s; opacity: 0; }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; text-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
          50% { opacity: 1; text-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .scan-line {
          animation: scan-line 1.5s linear infinite;
        }
        @keyframes typewriter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .type-in { animation: typewriter 0.3s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-2xl text-white mb-3 font-medium">What Your Job Will Be in 2035</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
          Enter your job title. I&apos;ll trace its probable evolution — which parts survive,
          which parts AI absorbs, and what new hybrid emerges.
          <br />
          <span className="text-gray-600">Not doom. Not hype. Honest extrapolation.</span>
        </p>
      </div>

      {/* Input step */}
      {step === 'input' && (
        <div className="max-w-xl mx-auto fade-up">
          <div className="mb-6">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
              What do you do?
            </label>
            <input
              ref={inputRef}
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Software Engineer, Teacher, Marketing Manager..."
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white text-base focus:border-gray-400 focus:outline-none placeholder-gray-700"
              maxLength={60}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!jobTitle.trim()}
            className="w-full py-3 border border-gray-400 text-gray-300 hover:border-white hover:text-white transition-colors text-sm uppercase tracking-wider disabled:border-gray-800 disabled:text-gray-700 disabled:cursor-not-allowed"
          >
            Show me my future
          </button>

          <div className="mt-6 bg-gray-950 border border-gray-800 p-4 text-xs text-gray-500 space-y-1">
            <p>🔒 <strong className="text-gray-400">No data leaves your browser.</strong> All analysis happens locally.</p>
            <p>🧙 This is pattern extrapolation, not prophecy. The future is unwritten — but the trends aren&apos;t.</p>
          </div>
        </div>
      )}

      {/* Analyzing step */}
      {step === 'analyzing' && (
        <div className="max-w-xl mx-auto text-center">
          <div className="relative border border-gray-800 bg-gray-950 p-8 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scan-line" />

            <div className="text-lg text-white mb-6 font-mono">
              Analyzing: <span className="text-accent">{jobTitle}</span>
            </div>

            <div className="space-y-2 text-left max-w-sm mx-auto">
              {analysisPhases.map((p, i) => (
                <div
                  key={i}
                  className={`text-sm font-mono transition-all duration-300 ${
                    i < phase ? 'text-green-500' :
                    i === phase ? 'text-gray-300 pulse-glow' :
                    'text-gray-800'
                  }`}
                >
                  {i < phase ? '✓' : i === phase ? '>' : ' '} {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results step */}
      {step === 'result' && result && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hybrid title reveal */}
          <div className="border border-accent-dim bg-black/60 p-6 text-center fade-up">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your role in 2035</div>
            <div className="text-xl md:text-2xl text-white font-medium mb-2">{result.hybridTitle}</div>
            <div className="text-xs text-gray-600">evolved from: {result.title}</div>
          </div>

          {/* Transformation meter */}
          <div className="border border-gray-800 bg-black/40 p-6 fade-up fade-up-delay-1">
            <TransformationMeter percent={result.transformationPercent} />
          </div>

          {/* Three columns: absorbed, survives, emerges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 fade-up fade-up-delay-2">
            <TaskCard
              label="AI absorbs"
              items={result.absorbed}
              color="border-red-900/40"
              icon="🤖"
            />
            <TaskCard
              label="You keep"
              items={result.survives}
              color="border-green-900/40"
              icon="🧠"
            />
            <TaskCard
              label="New skills"
              items={result.emerges}
              color="border-blue-900/40"
              icon="✨"
            />
          </div>

          {/* Timeline */}
          <div className="border border-gray-800 bg-black/40 p-6 fade-up fade-up-delay-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">The evolution</div>
            <TimelineView events={result.timeline} />
          </div>

          {/* WIZ comment */}
          <div className="border border-gray-800 bg-gray-900/30 p-5 fade-up fade-up-delay-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🧙</span>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">WIZ&apos;s take</div>
                <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{result.wizComment}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Bottom insight */}
          <div className="border border-gray-800 bg-gray-900/20 p-4 fade-up fade-up-delay-5">
            <p className="text-gray-500 text-xs leading-relaxed text-center">
              The future doesn&apos;t replace you. It reshapes you. The question isn&apos;t whether AI will change your job —
              it&apos;s whether you&apos;ll be the one who steers the change or the one who gets swept by it.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 fade-up fade-up-delay-6">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              Try another job
            </button>
            <button
              onClick={copyResults}
              className="flex-1 py-2.5 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Copy results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
