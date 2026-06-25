"use client"

import { useCallback, useRef, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileInput } from "@/components/profile-input"
import { AgentPipeline } from "@/components/agent-pipeline"
import { ResultsPanel } from "@/components/results-panel"
import { AGENTS, type AgentId, type AgentStatus, type AgentResults } from "@/lib/bi-data"

const API_URL = "https://multi-agent-bi.hammadsid1718.workers.dev"

const INITIAL_STATUSES = (): Record<AgentId, AgentStatus> =>
  AGENTS.reduce((acc, agent) => {
    acc[agent.id] = "pending"
    return acc
  }, {} as Record<AgentId, AgentStatus>)

export default function Page() {
  const [profile, setProfile] = useState("")
  const [statuses, setStatuses] = useState<Record<AgentId, AgentStatus>>(INITIAL_STATUSES)
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<AgentResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const run = useCallback(async () => {
    clearTimers()
    setShowResults(false)
    setError(null)
    setResults(null)
    setIsRunning(true)
    setStatuses(INITIAL_STATUSES())

    try {
      // Start run
      const startRes = await fetch(`${API_URL}/run/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile })
      })
      const { run_id } = await startRes.json()

      // Agent 1 - Market
      setStatuses(prev => ({ ...prev, market: "running" }))
      const m = await fetch(`${API_URL}/run/market`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile })
      })
      const { market } = await m.json()
      setStatuses(prev => ({ ...prev, market: "complete" }))

      // Agent 2 - Competitor
      setStatuses(prev => ({ ...prev, competitor: "running" }))
      const c = await fetch(`${API_URL}/run/competitor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile, marketData: market })
      })
      const { competitors } = await c.json()
      setStatuses(prev => ({ ...prev, competitor: "complete" }))

      // Agent 3 - Leads
      setStatuses(prev => ({ ...prev, leads: "running" }))
      const l = await fetch(`${API_URL}/run/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile, marketData: market, competitorData: competitors })
      })
      const { leads } = await l.json()
      setStatuses(prev => ({ ...prev, leads: "complete" }))

      // Agent 4 - Outreach
      setStatuses(prev => ({ ...prev, outreach: "running" }))
      const o = await fetch(`${API_URL}/run/outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile, leadsData: leads })
      })
      const { outreach } = await o.json()
      setStatuses(prev => ({ ...prev, outreach: "complete" }))

      // Agent 5 - Report
      setStatuses(prev => ({ ...prev, report: "running" }))
      const r = await fetch(`${API_URL}/run/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessProfile: profile,
          marketData: market,
          competitorData: competitors,
          leadsData: leads,
          outreachData: outreach,
          runId: run_id
        })
      })
      const { report } = await r.json()
      setStatuses(prev => ({ ...prev, report: "complete" }))

      // Map to UI format
      const mapped: AgentResults = {
        report: {
          overallScore: Math.round(
            ((report.score?.market_opportunity + report.score?.lead_quality) / 2) * 10
          ) || 75,
          scores: [
            { label: "Market Opportunity", value: (report.score?.market_opportunity || 7) * 10 },
            { label: "Competition Level", value: (report.score?.competition_level || 5) * 10 },
            { label: "Lead Quality", value: (report.score?.lead_quality || 7) * 10 },
            { label: "Go-to-Market Fit", value: 75 },
          ],
          highlights: report.market_highlights || [],
          actions: (report.recommended_actions || []).map((a: string, i: number) => ({
            title: a,
            detail: report.weekly_goals?.[i] || "",
            priority: (i === 0 ? "High" : i === 1 ? "Medium" : "Low") as "High" | "Medium" | "Low"
          }))
        },
        market: {
          tam: market?.market_size || "N/A",
          sam: "N/A",
          som: "N/A",
          growth: market?.growth_rate || "N/A",
          trends: (market?.key_trends || []).map((t: string) => ({
            title: t, detail: "", signal: "up" as const
          })),
          segments: (market?.target_customers || []).map((c: string, i: number) => ({
            name: c, share: i === 0 ? 60 : 40
          }))
        },
        competitors: (competitors?.competitors || []).map((c: any) => ({
          name: c.name || "",
          positioning: c.pricing || "N/A",
          pricing: c.pricing || "N/A",
          strength: Array.isArray(c.strengths) ? c.strengths[0] : c.strengths || "",
          weakness: Array.isArray(c.weaknesses) ? c.weaknesses[0] : c.weaknesses || "",
          threat: "Medium" as const
        })),
        leads: (leads?.leads || []).map((l: any) => ({
          company: l.company_name || "",
          website: l.website || "",
          industry: l.industry || "",
          fit: 85,
          reason: l.why_good_fit || ""
        })),
        outreach: (outreach?.outreach_drafts || []).map((o: any) => ({
          to: o.lead || "",
          company: o.lead || "",
          subject: o.subject || "",
          body: o.body || ""
        }))
      }

      setResults(mapped)
      setShowResults(true)

    } catch (err: any) {
      clearTimers()
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsRunning(false)
    }
  }, [profile])

  const reset = useCallback(() => {
    clearTimers()
    setStatuses(INITIAL_STATUSES())
    setIsRunning(false)
    setShowResults(false)
    setResults(null)
    setError(null)
  }, [])

  return (
    <main className="min-h-screen">
      <DashboardHeader />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <ProfileInput
          value={profile}
          onChange={setProfile}
          onRun={run}
          onReset={reset}
          isRunning={isRunning}
          hasRun={showResults || isRunning}
        />

        <AgentPipeline statuses={statuses} />

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        {showResults && results && <ResultsPanel results={results} />}
      </div>
    </main>
  )
}