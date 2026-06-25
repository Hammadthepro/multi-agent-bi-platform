import { runMarketResearch } from './agents/market-research.js';
import { runCompetitorAnalysis } from './agents/competitor.js';
import { runLeadGeneration } from './agents/lead-generation.js';
import { runOutreach } from './agents/outreach.js';
import { runReporting } from './agents/reporting.js';

export default {
  async fetch(request, env) {
    
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/") {
      return json({ status: "Multi-Agent BI Platform is live!", agents: 5 });
    }

    // Main agent run endpoint
    if (url.pathname === "/run" && request.method === "POST") {
      try {
        const { businessProfile } = await request.json();

        if (!businessProfile) {
          return json({ error: "businessProfile is required" }, 400);
        }

        // Generate unique run ID
        const runId = crypto.randomUUID();

        // Save run to D1
        await env.DB.prepare(
          "INSERT INTO runs (id, profile, status) VALUES (?, ?, ?)"
        ).bind(runId, businessProfile, "running").run();

        // ---- RUN ALL 5 AGENTS IN SEQUENCE ----

        // Agent 1
        const marketData = await runMarketResearch(businessProfile, env);

        // Agent 2
        const competitorData = await runCompetitorAnalysis(businessProfile, marketData, env);

        // Agent 3
        const leadsData = await runLeadGeneration(businessProfile, marketData, competitorData, env);

        // Save leads to D1
        for (const lead of leadsData.leads) {
          await env.DB.prepare(
            "INSERT INTO leads (id, run_id, company_name, website, notes) VALUES (?, ?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), runId, lead.company_name, lead.website, lead.why_good_fit).run();
        }

        // Save competitors to D1
        for (const comp of competitorData.competitors) {
          await env.DB.prepare(
            "INSERT INTO competitors (id, run_id, name, website, strengths, weaknesses) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), runId, comp.name, comp.website, 
            JSON.stringify(comp.strengths), JSON.stringify(comp.weaknesses)).run();
        }

        // Agent 4
        const outreachData = await runOutreach(businessProfile, leadsData, env);

        // Save outreach to D1
        for (const draft of outreachData.outreach_drafts) {
          await env.DB.prepare(
            "INSERT INTO outreach (id, lead_id, subject, body) VALUES (?, ?, ?, ?)"
          ).bind(crypto.randomUUID(), runId, draft.subject, draft.body).run();
        }

        // Agent 5
        const reportData = await runReporting(
          businessProfile, marketData, competitorData, 
          leadsData, outreachData, env
        );

        // Save report to D1
        await env.DB.prepare(
          "INSERT INTO reports (id, run_id, content) VALUES (?, ?, ?)"
        ).bind(crypto.randomUUID(), runId, JSON.stringify(reportData)).run();

        // Update run status
        await env.DB.prepare(
          "UPDATE runs SET status = ? WHERE id = ?"
        ).bind("completed", runId).run();

        // Return everything
        return json({
          run_id: runId,
          status: "completed",
          market: marketData,
          competitors: competitorData,
          leads: leadsData,
          outreach: outreachData,
          report: reportData
        });

      } catch (error) {
        return json({ error: error.message }, 500);
      }
    }

    // Get all past reports
    if (url.pathname === "/reports" && request.method === "GET") {
      const results = await env.DB.prepare(
        "SELECT * FROM reports ORDER BY created_at DESC LIMIT 10"
      ).all();
      return json({ reports: results.rows });
    }

    return json({ error: "Not found" }, 404);
  }
};

// Helper
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}