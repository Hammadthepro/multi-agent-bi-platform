export type AgentStatus = "pending" | "running" | "complete"

export type AgentId =
  | "market"
  | "competitor"
  | "leads"
  | "outreach"
  | "report"

export interface AgentDef {
  id: AgentId
  name: string
  role: string
  description: string
}

export const AGENTS: AgentDef[] = [
  {
    id: "market",
    name: "Market Research",
    role: "Analyst",
    description: "Sizes the market, maps trends, and scores opportunity.",
  },
  {
    id: "competitor",
    name: "Competitor Analysis",
    role: "Strategist",
    description: "Profiles rivals and surfaces positioning gaps.",
  },
  {
    id: "leads",
    name: "Lead Generation",
    role: "Prospector",
    description: "Finds and qualifies high-fit target accounts.",
  },
  {
    id: "outreach",
    name: "Outreach Drafting",
    role: "Copywriter",
    description: "Writes tailored first-touch emails per lead.",
  },
  {
    id: "report",
    name: "BI Report",
    role: "Synthesizer",
    description: "Compiles every signal into an executive brief.",
  },
]

export interface ScoreMetric {
  label: string
  value: number
}

export interface ReportData {
  overallScore: number
  scores: ScoreMetric[]
  highlights: string[]
  actions: { title: string; detail: string; priority: "High" | "Medium" | "Low" }[]
}

export interface MarketData {
  tam: string
  sam: string
  som: string
  growth: string
  trends: { title: string; detail: string; signal: "up" | "down" | "flat" }[]
  segments: { name: string; share: number }[]
}

export interface Competitor {
  name: string
  positioning: string
  pricing: string
  strength: string
  weakness: string
  threat: "High" | "Medium" | "Low"
}

export interface Lead {
  company: string
  website: string
  industry: string
  fit: number
  reason: string
}

export interface OutreachEmail {
  to: string
  company: string
  subject: string
  body: string
}

export interface AgentResults {
  report: ReportData
  market: MarketData
  competitors: Competitor[]
  leads: Lead[]
  outreach: OutreachEmail[]
}

export const MOCK_RESULTS: AgentResults = {
  report: {
    overallScore: 82,
    scores: [
      { label: "Market Opportunity", value: 88 },
      { label: "Competitive Edge", value: 74 },
      { label: "Lead Quality", value: 85 },
      { label: "Go-to-Market Fit", value: 79 },
    ],
    highlights: [
      "TAM of $14.2B growing 18% YoY with low incumbent NPS — clear room for a challenger.",
      "Top 3 competitors over-index on enterprise, leaving mid-market underserved.",
      "Generated 24 qualified accounts with an average fit score of 85/100.",
      "Outreach angle around onboarding speed tested strongest against rival messaging.",
    ],
    actions: [
      {
        title: "Target the mid-market gap",
        detail:
          "Position pricing and packaging for 50-500 employee teams that incumbents ignore.",
        priority: "High",
      },
      {
        title: "Launch the onboarding-speed campaign",
        detail:
          "Lead all outreach with the '14-day to value' proof point that beat competitor messaging.",
        priority: "High",
      },
      {
        title: "Prioritize the 8 highest-fit leads",
        detail:
          "Route accounts scoring 90+ to founder-led outreach within 48 hours.",
        priority: "Medium",
      },
      {
        title: "Build a competitive teardown asset",
        detail:
          "Codify the positioning gaps into a sales one-pager for the team.",
        priority: "Low",
      },
    ],
  },
  market: {
    tam: "$14.2B",
    sam: "$4.8B",
    som: "$610M",
    growth: "+18% YoY",
    trends: [
      {
        title: "AI-native tooling adoption",
        detail: "62% of mid-market teams plan to add AI workflow tools this year.",
        signal: "up",
      },
      {
        title: "Consolidation of point solutions",
        detail: "Buyers want fewer vendors — platform plays are winning RFPs.",
        signal: "up",
      },
      {
        title: "Pricing pressure on seat-based models",
        detail: "Usage-based pricing expectations are rising across the segment.",
        signal: "down",
      },
      {
        title: "Stable compliance requirements",
        detail: "SOC 2 + GDPR remain table stakes with no major regulatory shift.",
        signal: "flat",
      },
    ],
    segments: [
      { name: "Mid-market SaaS", share: 42 },
      { name: "Agencies & services", share: 28 },
      { name: "E-commerce", share: 19 },
      { name: "Other", share: 11 },
    ],
  },
  competitors: [
    {
      name: "Northbeam Analytics",
      positioning: "Enterprise-first BI suite",
      pricing: "$$$$",
      strength: "Deep integrations & brand trust",
      weakness: "Slow onboarding, costly for SMBs",
      threat: "High",
    },
    {
      name: "Pulse Metrics",
      positioning: "Self-serve dashboards",
      pricing: "$$",
      strength: "Fast setup, generous free tier",
      weakness: "Shallow analysis, no AI agents",
      threat: "Medium",
    },
    {
      name: "Cortex IQ",
      positioning: "AI insights add-on",
      pricing: "$$$",
      strength: "Strong ML models",
      weakness: "Requires existing data warehouse",
      threat: "Medium",
    },
    {
      name: "LedgerLoop",
      positioning: "Finance-focused reporting",
      pricing: "$$",
      strength: "Accounting integrations",
      weakness: "Narrow use case",
      threat: "Low",
    },
  ],
  leads: [
    {
      company: "Brightwave Labs",
      website: "brightwavelabs.io",
      industry: "Mid-market SaaS",
      fit: 94,
      reason: "Recently raised Series B; hiring 3 data analysts — clear BI need.",
    },
    {
      company: "Orbit Commerce",
      website: "orbitcommerce.com",
      industry: "E-commerce",
      fit: 91,
      reason: "Multi-store operator with no central analytics layer today.",
    },
    {
      company: "Quill & Co.",
      website: "quillandco.agency",
      industry: "Agency",
      fit: 88,
      reason: "Manages reporting for 40+ clients; manual spreadsheet workflow.",
    },
    {
      company: "Tidal Logistics",
      website: "tidallogistics.com",
      industry: "Operations",
      fit: 85,
      reason: "Public job post mentions replacing legacy dashboards.",
    },
    {
      company: "Fern Health",
      website: "fernhealth.co",
      industry: "Healthtech",
      fit: 82,
      reason: "Scaling fast post-launch; compliance-ready BI is a stated priority.",
    },
    {
      company: "Maple Retail Group",
      website: "mapleretail.com",
      industry: "Retail",
      fit: 78,
      reason: "Fragmented store-level data across regions ready for consolidation.",
    },
  ],
  outreach: [
    {
      to: "Dana Reyes, VP Data",
      company: "Brightwave Labs",
      subject: "Cut Brightwave's reporting time from days to minutes",
      body: "Hi Dana,\n\nCongrats on the Series B — and on the data analyst roles I saw you're hiring for. Teams scaling as fast as Brightwave usually hit a wall where reporting eats the week.\n\nWe help mid-market SaaS teams stand up an AI-driven BI layer in under 14 days, so your new hires spend time on insight, not assembly. Worth a 20-minute look next week?\n\nBest,\nAlex",
    },
    {
      to: "Sam Okafor, COO",
      company: "Orbit Commerce",
      subject: "One source of truth across your stores",
      body: "Hi Sam,\n\nRunning multiple storefronts without a central analytics layer means every decision starts with a data hunt. We unify multi-store metrics into one live view and let agents surface what changed and why.\n\nHappy to send a 3-minute teardown of what this would look like for Orbit. Open to it?\n\nThanks,\nAlex",
    },
    {
      to: "Priya Nair, Founder",
      company: "Quill & Co.",
      subject: "Client reporting without the spreadsheet grind",
      body: "Hi Priya,\n\nReporting for 40+ clients in spreadsheets is a heavy lift — and it doesn't scale with new accounts. We automate client-ready BI dashboards so your team ships polished reports in minutes.\n\nCould I show you a sample agency workspace this week?\n\nBest,\nAlex",
    },
  ],
}
