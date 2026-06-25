import { callGroq } from '../utils/groq.js';
import { searchWeb } from '../utils/tavily.js';

export async function runMarketResearch(businessProfile, env) {
  console.log("Agent 1: Market Research starting...");

  // Step 1: Search the web
  const searchResults = await searchWeb(
    `${businessProfile} market size trends demand 2024 2025`,
    env
  );

  const searchContext = searchResults
    .map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
    .join('\n\n');

  // Step 2: Analyze with Groq
  const analysis = await callGroq(
    `Based on these search results, analyze the market for: "${businessProfile}"
    
Search Results:
${searchContext}

Return a JSON object with this exact structure:
{
  "market_size": "estimated market size",
  "growth_rate": "annual growth rate",
  "key_trends": ["trend1", "trend2", "trend3"],
  "target_customers": ["customer type 1", "customer type 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "summary": "2-3 sentence market overview"
}`,
    "You are a market research analyst. Always respond with valid JSON only, no extra text.",
    env
  );

  try {
    return JSON.parse(analysis);
  } catch (e) {
    // Clean up if Groq adds markdown
    const cleaned = analysis.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}