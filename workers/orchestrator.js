import { runMarketResearch } from './agents/market-research.js';
import { runCompetitorAnalysis } from './agents/competitor.js';
import { runLeadGeneration } from './agents/lead-generation.js';
import { runOutreach } from './agents/outreach.js';
import { runReporting } from './agents/reporting.js';

export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/") {
      return json({ status: "Multi-Agent BI Platform is live!", agents: 5 });
    }

    // Create a new run
    if (url.pathname === "/run/start" && request.method === "POST") {
      const { businessProfile } = await request.json();
      const runId = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO runs (id, profile, status) VALUES (?, ?, ?)"
      ).bind(runId, businessProfile, "running").run();
      return json({ run_id: runId });
    }

    // Agent 1
    if (url.pathname === "/run/market" && request.method === "POST") {
      const { businessProfile } = await request.json();
      const data = await runMarketResearch(businessProfile, env);
      return json({ market: data });
    }

    // Agent 2
    if (url.pathname === "/run/competitor" && request.method === "POST") {
      const { businessProfile, marketData } = await request.json();
      const data = await runCompetitorAnalysis(businessProfile, marketData, env);
      return json({ competitors: data });
    }

    // Agent 3
    if (url.pathname === "/run/leads" && request.method === "POST") {
      const { businessProfile, marketData, competitorData } = await request.json();
      const data = await runLeadGeneration(businessProfile, marketData, competitorData, env);
      return json({ leads: data });
    }

    // Agent 4
    if (url.pathname === "/run/outreach" && request.method === "POST") {
      const { businessProfile, leadsData } = await request.json();
      const data = await runOutreach(businessProfile, leadsData, env);
      return json({ outreach: data });
    }

    // Agent 5
    if (url.pathname === "/run/report" && request.method === "POST") {
      const { businessProfile, marketData, competitorData, leadsData, outreachData, runId } = await request.json();
      const data = await runReporting(businessProfile, marketData, competitorData, leadsData, outreachData, env);

      // Save everything to D1
      await env.DB.prepare("UPDATE runs SET status = ? WHERE id = ?")
        .bind("completed", runId).run();
      await env.DB.prepare("INSERT INTO reports (id, run_id, content) VALUES (?, ?, ?)")
        .bind(crypto.randomUUID(), runId, JSON.stringify(data)).run();

      return json({ report: data });
    }

    return json({ error: "Not found" }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}