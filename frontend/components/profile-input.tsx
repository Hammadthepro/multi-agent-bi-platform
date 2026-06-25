"use client"

import { Loader2, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileInputProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  onReset: () => void
  isRunning: boolean
  hasRun: boolean
}

const PLACEHOLDER =
  "e.g. We're a B2B SaaS startup building an AI-powered analytics platform for mid-market e-commerce teams. We help operators consolidate data across stores and surface revenue insights automatically. Target customers: 50-500 employee online retailers in North America."

export function ProfileInput({
  value,
  onChange,
  onRun,
  onReset,
  isRunning,
  hasRun,
}: ProfileInputProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <label
            htmlFor="business-profile"
            className="text-sm font-medium text-foreground"
          >
            Business Profile
          </label>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Describe your company, product, and target market. The agents use
            this as their shared brief.
          </p>
        </div>
      </div>

      <textarea
        id="business-profile"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        disabled={isRunning}
        rows={5}
        className="w-full resize-y rounded-xl border border-input bg-background/60 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={onRun}
          disabled={isRunning || value.trim().length === 0}
        >
          {isRunning ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Running agents…
            </>
          ) : (
            <>
              <Play aria-hidden="true" />
              Run All Agents
            </>
          )}
        </Button>

        {hasRun && !isRunning && (
          <Button size="lg" variant="outline" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          5 agents · sequential pipeline
        </span>
      </div>
    </section>
  )
}
