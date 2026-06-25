import { callGroq } from '../utils/groq.js';

export async function runOutreach(businessProfile, leadsData, env) {
  console.log("Agent 4: Outreach starting...");

  const outreachList = [];

  // Generate personalized email for each lead
  for (const lead of leadsData.leads) {
    const email = await callGroq(
      `Write a personalized cold email for this lead:

Our Business: ${businessProfile}
Lead Company: ${lead.company_name}
Lead Website: ${lead.website}
Why Good Fit: ${lead.why_good_fit}
Industry: ${lead.industry}

Return a JSON object with this exact structure:
{
  "subject": "email subject line",
  "body": "full email body with personalization",
  "follow_up": "one line follow up message for 3 days later"
}`,
      "You are an expert cold email copywriter. Write concise, personalized, non-spammy emails. Always respond with valid JSON only, no extra text.",
      env
    );

    try {
      const parsed = JSON.parse(email);
      outreachList.push({
        lead: lead.company_name,
        website: lead.website,
        ...parsed
      });
    } catch (e) {
      const cleaned = email.replace(/```json|```/g, '').trim();
      outreachList.push({
        lead: lead.company_name,
        website: lead.website,
        ...JSON.parse(cleaned)
      });
    }
  }

  return {
    outreach_drafts: outreachList,
    total_drafted: outreachList.length
  };
}