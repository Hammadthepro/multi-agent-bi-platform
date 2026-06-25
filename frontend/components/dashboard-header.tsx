import { Sparkles } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:px-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/30">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Multi-Agent BI Platform
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Orchestrate five specialized AI agents to turn a business profile
            into market intel, qualified leads, and a board-ready report.
          </p>
        </div>
      </div>
    </header>
  )
}
