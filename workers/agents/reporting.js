import { callGroq } from '../utils/groq.js';

export async function runReporting(businessProfile, marketData, competitorData, leadsData, outreachData, env) {
  console.log("Agent 5: Reporting starting...");

  const report = await callGroq(
    `Create a comprehensive business intelligence report for: "${businessProfile}"

MARKET RESEARCH:
${JSON.stringify(marketData)}

COMPETITOR ANALYSIS:
${JSON.stringify(competitorData)}

LEADS FOUND:
${JSON.stringify(leadsData)}

OUTREACH DRAFTED:
${JSON.stringify(outreachData)}

Return a JSON object with this exact structure:
{
  "report_title": "Weekly BI Report - [Business Name]",
  "generated_at": "current date",
  "executive_summary": "3-4 sentence overview of everything",
  "market_highlights": ["highlight1", "highlight2", "highlight3"],
  "top_competitors": ["competitor1", "competitor2"],
  "top_leads": ["lead1", "lead2", "lead3"],
  "recommended_actions": ["action1", "action2", "action3"],
  "weekly_goals": ["goal1", "goal2", "goal3"],
  "score": {
    "market_opportunity": "1-10 score",
    "competition_level": "1-10 score",
    "lead_quality": "1-10 score"
  }
}`,
    "You are a business intelligence analyst. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(report);
  } catch (e) {
    const cleaned = report.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}