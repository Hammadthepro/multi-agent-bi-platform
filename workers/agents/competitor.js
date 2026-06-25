import { callGroq } from '../utils/groq.js';
import { searchWeb } from '../utils/tavily.js';

export async function runCompetitorAnalysis(businessProfile, marketData, env) {
  console.log("Agent 2: Competitor Analysis starting...");

  // Step 1: Search for competitors
  const searchResults = await searchWeb(
    `top competitors ${businessProfile} companies 2024 2025`,
    env
  );

  const searchContext = searchResults
    .map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
    .join('\n\n');

  // Step 2: Analyze with Groq
  const analysis = await callGroq(
    `Based on these search results, identify competitors for: "${businessProfile}"

Market Context:
${JSON.stringify(marketData)}

Search Results:
${searchContext}

Return a JSON object with this exact structure:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "website.com",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "pricing": "pricing model if known"
    }
  ],
  "market_gaps": ["gap1", "gap2", "gap3"],
  "our_advantages": ["advantage1", "advantage2"]
}`,
    "You are a competitor analysis expert. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(analysis);
  } catch (e) {
    const cleaned = analysis.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}