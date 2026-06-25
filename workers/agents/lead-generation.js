import { callGroq } from '../utils/groq.js';
import { searchWeb } from '../utils/tavily.js';

export async function runLeadGeneration(businessProfile, marketData, competitorData, env) {
  console.log("Agent 3: Lead Generation starting...");

  // Step 1: Search for potential leads
  const searchResults = await searchWeb(
    `US ecommerce businesses looking for Shopify development agency 2024 2025`,
    env
  );

  const searchContext = searchResults
    .map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
    .join('\n\n');

  // Step 2: Generate leads with Groq
  const leads = await callGroq(
    `Based on these search results, identify potential leads for: "${businessProfile}"

Market Data: ${JSON.stringify(marketData)}
Competitor Gaps: ${JSON.stringify(competitorData.market_gaps)}

Search Results:
${searchContext}

Return a JSON object with this exact structure:
{
  "leads": [
    {
      "company_name": "Company Name",
      "website": "website.com",
      "industry": "their industry",
      "why_good_fit": "reason they need our service",
      "estimated_size": "small/medium/large",
      "contact_hint": "where to find contact info"
    }
  ],
  "total_found": 5,
  "best_channels": ["channel1", "channel2"]
}`,
    "You are a lead generation expert. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(leads);
  } catch (e) {
    const cleaned = leads.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}