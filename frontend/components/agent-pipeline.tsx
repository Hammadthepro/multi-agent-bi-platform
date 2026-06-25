"use client"

import {
  BarChart3,
  Check,
  FileText,
  Loader2,
  Mail,
  Search,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"
import { AGENTS, type AgentId, type AgentStatus } from "@/lib/bi-data"
import { cn } from "@/lib/utils"

const ICONS: Record<AgentId, LucideIcon> = {
  market: Search,
  competitor: Target,
  leads: Users,
  outreach: Mail,
  report: FileText,
}

interface AgentPipelineProps {
  statuses: Record<AgentId, AgentStatus>
}

const STATUS_LABEL: Record<AgentStatus, string> = {
  pending: "Pending",
  running: "Running",
  complete: "Complete",
}

export function AgentPipeline({ statuses }: AgentPipelineProps) {
  const completed = AGENTS.filter((a) => statuses[a.id] === "complete").length
  const progress = Math.round((completed / AGENTS.length) * 100)

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">
            Agent Pipeline
          </h2>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {completed}/{AGENTS.length} complete
        </span>
      </div>

      <div
        className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {AGENTS.map((agent, index) => {
          const status = statuses[agent.id]
          const Icon = ICONS[agent.id]
          return (
            <li
              key={agent.id}
              className={cn(
                "relative rounded-xl border p-4 transition-colors",
                status === "running" &&
                  "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_var(--color-primary)]",
                status === "complete" &&
                  "border-primary/30 bg-primary/5",
                status === "pending" && "border-border/60 bg-background/40",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg ring-1 ring-inset transition-colors",
                    status === "pending" &&
                      "bg-secondary text-muted-foreground ring-border",
                    status !== "pending" &&
                      "bg-primary/15 text-primary ring-primary/30",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <StatusBadge status={status} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Agent {index + 1} · {agent.role}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {agent.name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {agent.description}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "pending" && "bg-secondary text-muted-foreground",
        status === "running" && "bg-primary/20 text-primary",
        status === "complete" && "bg-primary/15 text-primary",
      )}
    >
      {status === "running" && (
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
      )}
      {status === "complete" && <Check className="size-3" aria-hidden="true" />}
      {STATUS_LABEL[status]}
    </span>
  )
}
