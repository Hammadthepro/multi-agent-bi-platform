"use client"

import { useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Mail,
  Minus,
} from "lucide-react"
import type { AgentResults } from "@/lib/bi-data"
import { cn } from "@/lib/utils"

type TabId = "report" | "market" | "competitors" | "leads" | "outreach"

const TABS: { id: TabId; label: string }[] = [
  { id: "report", label: "Report" },
  { id: "market", label: "Market" },
  { id: "competitors", label: "Competitors" },
  { id: "leads", label: "Leads" },
  { id: "outreach", label: "Outreach" },
]

export function ResultsPanel({ results }: { results: AgentResults }) {
  const [active, setActive] = useState<TabId>("report")

  return (
    <section className="rounded-2xl border border-border/60 bg-card">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 p-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            aria-pressed={active === tab.id}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {active === "report" && <ReportTab data={results.report} />}
        {active === "market" && <MarketTab data={results.market} />}
        {active === "competitors" && (
          <CompetitorsTab data={results.competitors} />
        )}
        {active === "leads" && <LeadsTab data={results.leads} />}
        {active === "outreach" && <OutreachTab data={results.outreach} />}
      </div>
    </section>
  )
}

function priorityClass(p: "High" | "Medium" | "Low") {
  if (p === "High") return "bg-primary/20 text-primary"
  if (p === "Medium") return "bg-accent/20 text-accent-foreground"
  return "bg-secondary text-muted-foreground"
}

function ReportTab({ data }: { data: AgentResults["report"] }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4">
          <div className="text-4xl font-bold tabular-nums text-primary">
            {data.overallScore}
          </div>
          <div className="text-xs leading-tight text-muted-foreground">
            Overall
            <br />
            opportunity
            <br />
            score
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
          {data.scores.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">
                  {s.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {s.value}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Key Highlights
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-xl border border-border/60 bg-background/40 p-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Recommended Actions
        </h3>
        <div className="space-y-3">
          {data.actions.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border/60 bg-background/40 p-4"
            >
              <span className="mt-0.5 text-sm font-semibold tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {a.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {a.detail}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  priorityClass(a.priority),
                )}
              >
                {a.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MarketTab({ data }: { data: AgentResults["market"] }) {
  const sizing = [
    { label: "TAM", value: data.tam },
    { label: "SAM", value: data.sam },
    { label: "SOM", value: data.som },
    { label: "Growth", value: data.growth },
  ]
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {sizing.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-border/60 bg-background/40 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Market Trends
          </h3>
          <ul className="space-y-3">
            {data.trends.map((t, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <TrendIcon signal={t.signal} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Segment Breakdown
          </h3>
          <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
            {data.segments.map((s) => (
              <div key={s.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{s.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.share}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${s.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrendIcon({ signal }: { signal: "up" | "down" | "flat" }) {
  const base = "flex size-7 shrink-0 items-center justify-center rounded-lg"
  if (signal === "up")
    return (
      <span className={cn(base, "bg-primary/15 text-primary")}>
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
    )
  if (signal === "down")
    return (
      <span className={cn(base, "bg-destructive/15 text-destructive")}>
        <ArrowDownRight className="size-4" aria-hidden="true" />
      </span>
    )
  return (
    <span className={cn(base, "bg-secondary text-muted-foreground")}>
      <Minus className="size-4" aria-hidden="true" />
    </span>
  )
}

function CompetitorsTab({ data }: { data: AgentResults["competitors"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.map((c) => (
        <div
          key={c.name}
          className="rounded-xl border border-border/60 bg-background/40 p-4"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.positioning}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                priorityClass(c.threat),
              )}
            >
              {c.threat} threat
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pricing</dt>
              <dd className="font-medium text-foreground">{c.pricing}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Strength</dt>
              <dd className="text-right text-foreground">{c.strength}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Weakness</dt>
              <dd className="text-right text-foreground">{c.weakness}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  )
}

function LeadsTab({ data }: { data: AgentResults["leads"] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2 font-medium">Company</th>
            <th className="px-3 py-2 font-medium">Website</th>
            <th className="px-3 py-2 font-medium">Fit</th>
            <th className="px-3 py-2 font-medium">Why it&apos;s a fit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((lead) => (
            <tr
              key={lead.company}
              className="border-b border-border/40 last:border-0 hover:bg-secondary/40"
            >
              <td className="px-3 py-3 align-top">
                <p className="font-medium text-foreground">{lead.company}</p>
                <p className="text-xs text-muted-foreground">
                  {lead.industry}
                </p>
              </td>
              <td className="px-3 py-3 align-top">
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {lead.website}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </td>
              <td className="px-3 py-3 align-top">
                <span className="inline-flex items-center gap-2">
                  <span className="font-semibold tabular-nums text-foreground">
                    {lead.fit}
                  </span>
                  <span className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-secondary sm:inline-block">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${lead.fit}%` }}
                    />
                  </span>
                </span>
              </td>
              <td className="max-w-xs px-3 py-3 align-top leading-relaxed text-muted-foreground">
                {lead.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OutreachTab({ data }: { data: AgentResults["outreach"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {data.map((email, i) => (
        <article
          key={i}
          className="flex flex-col rounded-xl border border-border/60 bg-background/40"
        >
          <header className="flex items-center gap-3 border-b border-border/60 p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-inset ring-primary/30">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {email.to}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {email.company}
              </p>
            </div>
          </header>
          <div className="p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Subject
            </p>
            <p className="mb-4 text-sm font-semibold text-foreground">
              {email.subject}
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {email.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
