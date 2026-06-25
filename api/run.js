import { callGroq } from '../workers/utils/groq.js';
import { searchWeb } from '../workers/utils/tavily.js';

// Agent 1
async function runMarketResearch(businessProfile, env) {
  const searchResults = await searchWeb(
    `${businessProfile} market size trends demand 2024 2025`,
    env
  );

  const searchContext = searchResults
    .map(
      r =>
        `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    )
    .join('\n\n');

  const analysis = await callGroq(
    `Based on these search results, analyze the market for: "${businessProfile}"

Search Results:
${searchContext}

Return JSON only:
{"market_size":"...","growth_rate":"...","key_trends":[],"target_customers":[],"opportunities":[],"summary":"..."}`,
    "You are a market research analyst. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(analysis);
  } catch {
    return JSON.parse(
      analysis.replace(/```json|```/g, '').trim()
    );
  }
}

// Agent 2
async function runCompetitorAnalysis(
  businessProfile,
  marketData,
  env
) {
  const searchResults = await searchWeb(
    `top competitors ${businessProfile} companies 2024`,
    env
  );

  const searchContext = searchResults
    .map(
      r =>
        `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    )
    .join('\n\n');

  const analysis = await callGroq(
    `Identify competitors for: "${businessProfile}"

Market Context:
${JSON.stringify(marketData)}

Search Results:
${searchContext}

Return JSON only:
{"competitors":[{"name":"","website":"","strengths":[],"weaknesses":[],"pricing":""}],"market_gaps":[],"our_advantages":[]}`,
    "You are a competitor analysis expert. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(analysis);
  } catch {
    return JSON.parse(
      analysis.replace(/```json|```/g, '').trim()
    );
  }
}

// Agent 3
async function runLeadGeneration(
  businessProfile,
  marketData,
  competitorData,
  env
) {
  const searchResults = await searchWeb(
    `US ecommerce businesses looking for Shopify development 2024`,
    env
  );

  const searchContext = searchResults
    .map(
      r =>
        `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    )
    .join('\n\n');

  const leads = await callGroq(
    `Find potential leads for: "${businessProfile}"

Market Data: ${JSON.stringify(marketData)}
Competitor Gaps: ${JSON.stringify(
      competitorData?.market_gaps
    )}

Search Results:
${searchContext}

Return JSON only:
{"leads":[{"company_name":"","website":"","industry":"","why_good_fit":"","estimated_size":"","contact_hint":""}],"total_found":5,"best_channels":[]}`,
    "You are a lead generation expert. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(leads);
  } catch {
    return JSON.parse(
      leads.replace(/```json|```/g, '').trim()
    );
  }
}

// Agent 4
async function runOutreach(
  businessProfile,
  leadsData,
  env
) {
  const outreachList = [];

  for (const lead of leadsData?.leads || []) {
    const email = await callGroq(
      `Write a personalized cold email for:
Our Business: ${businessProfile}
Lead: ${lead.company_name}
Website: ${lead.website}
Why Good Fit: ${lead.why_good_fit}

Return JSON only:
{"subject":"","body":"","follow_up":""}`,
      "You are an expert cold email copywriter. Always respond with valid JSON only, no extra text.",
      env
    );

    try {
      const parsed = JSON.parse(email);

      outreachList.push({
        lead: lead.company_name,
        website: lead.website,
        ...parsed
      });
    } catch {
      const parsed = JSON.parse(
        email.replace(/```json|```/g, '').trim()
      );

      outreachList.push({
        lead: lead.company_name,
        website: lead.website,
        ...parsed
      });
    }
  }

  return {
    outreach_drafts: outreachList,
    total_drafted: outreachList.length
  };
}

// Agent 5
async function runReporting(
  businessProfile,
  marketData,
  competitorData,
  leadsData,
  outreachData,
  env
) {
  const report = await callGroq(
    `Create a BI report for: "${businessProfile}"

MARKET: ${JSON.stringify(marketData)}
COMPETITORS: ${JSON.stringify(competitorData)}
LEADS: ${JSON.stringify(leadsData)}
OUTREACH: ${JSON.stringify(outreachData)}

Return JSON only:
{"report_title":"","generated_at":"","executive_summary":"","market_highlights":[],"top_competitors":[],"top_leads":[],"recommended_actions":[],"weekly_goals":[],"score":{"market_opportunity":8,"competition_level":6,"lead_quality":7}}`,
    "You are a business intelligence analyst. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(report);
  } catch {
    return JSON.parse(
      report.replace(/```json|```/g, '').trim()
    );
  }
}

// Main handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed' });
  }

  const { businessProfile } = req.body;

  if (!businessProfile) {
    return res
      .status(400)
      .json({ error: 'businessProfile is required' });
  }

  const env = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY
  };

  try {
    const runId = crypto.randomUUID();

    const marketData = await runMarketResearch(
      businessProfile,
      env
    );

    const competitorData =
      await runCompetitorAnalysis(
        businessProfile,
        marketData,
        env
      );

    const leadsData = await runLeadGeneration(
      businessProfile,
      marketData,
      competitorData,
      env
    );

    const outreachData = await runOutreach(
      businessProfile,
      leadsData,
      env
    );

    const reportData = await runReporting(
      businessProfile,
      marketData,
      competitorData,
      leadsData,
      outreachData,
      env
    );

    return res.status(200).json({
      run_id: runId,
      status: 'completed',
      market: marketData || {},
      competitors: competitorData || {},
      leads: leadsData || {},
      outreach: outreachData || {},
      report: reportData || {}
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

export const config = {
  maxDuration: 60
};