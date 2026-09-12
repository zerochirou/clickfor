"use client";

import * as React from "react";

export function TrustLogoStrip() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 border-y border-hairline/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Intentionally quiet centered header */}
        <p className="mono-tag text-xs font-medium text-slate-custom tracking-widest uppercase">
          [ POWERING MISSION-CRITICAL INTELLIGENCE ACROSS GLOBAL ENTERPRISES ]
        </p>

        {/* Monochrome Logo Strip with Generous Spacing */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center opacity-75 grayscale transition-all hover:grayscale-0">
          {/* Oracle */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tighter text-ink/80 group-hover:text-black transition-colors">
              ORACLE
            </span>
          </div>

          {/* Salesforce */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-sans text-lg sm:text-xl font-semibold tracking-tight text-ink/80 group-hover:text-black transition-colors">
              salesforce
            </span>
          </div>

          {/* McKinsey */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-display text-lg sm:text-xl font-medium tracking-tight text-ink/80 group-hover:text-black transition-colors">
              McKinsey<span className="text-xs">&</span>Co
            </span>
          </div>

          {/* Datadog */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-mono text-base sm:text-lg font-bold tracking-tight text-ink/80 group-hover:text-black transition-colors">
              DATADOG
            </span>
          </div>

          {/* Notion */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-sans text-lg sm:text-xl font-medium tracking-tight text-ink/80 group-hover:text-black transition-colors">
              Notion
            </span>
          </div>

          {/* Spotify */}
          <div className="flex items-center gap-2 group cursor-default">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink/80 group-hover:text-black transition-colors">
              Spotify
            </span>
          </div>
        </div>

        {/* Editorial Trust Statement */}
        <div className="mt-10 max-w-2xl text-xs font-mono text-muted-slate leading-relaxed">
          Over 2,000+ enterprise teams run proprietary retrieval and agentic
          workloads on Cohere models with guaranteed compliance and data
          isolation.
        </div>
      </div>
    </section>
  );
}
