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

    // Animate agents while API runs
    const agentIds: AgentId[] = ["market", "competitor", "leads", "outreach", "report"]
    const stepMs = 10000 // ~10s per agent
    agentIds.forEach((id, index) => {
      timers.current.push(
        setTimeout(() => {
          setStatuses(prev => ({ ...prev, [id]: "running" }))
        }, index * stepMs)
      )
    })

    try {
      const res = await fetch(`${API_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessProfile: profile })
      })

      const data = await res.json()
      clearTimers()

      if (data.error) throw new Error(data.error)

      // Map API response to UI format
      const mapped: AgentResults = {
        report: {
          overallScore: Math.round(
            ((data.report.score.market_opportunity +
              data.report.score.lead_quality) / 2) * 10
          ),
          scores: [
            { label: "Market Opportunity", value: data.report.score.market_opportunity * 10 },
            { label: "Competition Level", value: data.report.score.competition_level * 10 },
            { label: "Lead Quality", value: data.report.score.lead_quality * 10 },
            { label: "Go-to-Market Fit", value: 75 },
          ],
          highlights: data.report.market_highlights || [],
          actions: (data.report.recommended_actions || []).map((a: string, i: number) => ({
            title: a,
            detail: data.report.weekly_goals?.[i] || "",
            priority: i === 0 ? "High" : i === 1 ? "Medium" : "Low"
          }))
        },
        market: {
          tam: data.market.market_size || "N/A",
          sam: "N/A",
          som: "N/A",
          growth: data.market.growth_rate || "N/A",
          trends: (data.market.key_trends || []).map((t: string) => ({
            title: t,
            detail: "",
            signal: "up" as const
          })),
          segments: (data.market.target_customers || []).map((c: string, i: number) => ({
            name: c,
            share: i === 0 ? 60 : 40
          }))
        },
        competitors: (data.competitors.competitors || []).map((c: any) => ({
          name: c.name,
          positioning: c.pricing || "N/A",
          pricing: c.pricing || "N/A",
          strength: Array.isArray(c.strengths) ? c.strengths[0] : c.strengths,
          weakness: Array.isArray(c.weaknesses) ? c.weaknesses[0] : c.weaknesses,
          threat: "Medium" as const
        })),
        leads: (data.leads.leads || []).map((l: any) => ({
          company: l.company_name,
          website: l.website,
          industry: l.industry,
          fit: 85,
          reason: l.why_good_fit
        })),
        outreach: (data.outreach.outreach_drafts || []).map((o: any) => ({
          to: o.lead,
          company: o.lead,
          subject: o.subject,
          body: o.body
        }))
      }

      // Mark all agents complete
      setStatuses(agentIds.reduce((acc, id) => {
        acc[id] = "complete"
        return acc
      }, {} as Record<AgentId, AgentStatus>))

      setResults(mapped)
      setShowResults(true)

    } catch (err: any) {
      clearTimers()
      setError(err.message || "Something went wrong")
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