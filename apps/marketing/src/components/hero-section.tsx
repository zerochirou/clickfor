"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ServerIcon,
} from "lucide-react";
import { AgentConsoleInteractive } from "./agent-console-interactive";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Top Badge: System marker */}
        <div className="mb-6 flex items-center justify-center">
          <Badge
            variant="outline"
            className="rounded-full border-hairline bg-surface-stone/70 px-3.5 py-1 text-xs font-mono text-ink/90 backdrop-blur-xs flex items-center gap-2"
          >
            <span className="size-1.5 rounded-full bg-brand-coral" />
            <span className="text-brand-coral font-semibold uppercase">
              SYSTEM // 01
            </span>
            <span className="text-hairline">|</span>
            <span>ENTERPRISE FRONTIER AI PLATFORM</span>
          </Badge>
        </div>

        {/* Monumental Hero Headline */}
        <h1 className="hero-headline max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-ink font-normal tracking-[-0.035em] text-balance">
          Sovereign AI infrastructure built for enterprise precision.
        </h1>

        {/* Lead Copy */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-ink/75 font-normal leading-relaxed font-sans text-balance">
          Command high-accuracy reasoning, zero-hallucination enterprise RAG,
          and multi-step tool use. Deploy directly in your private cloud with
          zero data retention.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#contact" />}
            className="rounded-4xl bg-brand-nearblack text-white hover:bg-brand-nearblack/90 px-7 h-12 text-sm font-medium inline-flex items-center gap-2 shadow-sm transition-all"
          >
            Request a demo
            <ArrowRightIcon className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            variant="link"
            size="lg"
            nativeButton={false}
            render={<a href="#models" />}
            className="text-brand-blue hover:text-brand-blue-hover text-sm font-medium underline underline-offset-4 inline-flex items-center gap-1.5 transition-colors"
          >
            Explore foundation models
            <ArrowUpRightIcon className="size-4" data-icon="inline-end" />
          </Button>
        </div>

        {/* Value trust proof row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono text-muted-slate uppercase">
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3.5 text-brand-green" />
            ZERO DATA RETENTION (SOC2 TYPE II)
          </span>
          <span className="hidden sm:inline-block text-hairline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3.5 text-brand-green" />
            100% GROUNDED CITATIONS
          </span>
          <span className="hidden sm:inline-block text-hairline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3.5 text-brand-green" />
            VPC / ON-PREMISE AIR-GAPPED DEPLOY
          </span>
        </div>

        {/* Hero Media Composition: 2-Card Layout matching CORE-UI.md */}
        <div
          id="interactive-console"
          className="mt-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Main Wide Card: Interactive Agent Console (8 Cols) */}
          <div className="lg:col-span-8 flex">
            <AgentConsoleInteractive />
          </div>

          {/* Narrow Tactical Intelligence Card (4 Cols, 22px radius, Deep Enterprise Green backdrop) */}
          <div className="lg:col-span-4 rounded-[22px] bg-brand-green text-white p-6 sm:p-7 flex flex-col justify-between border border-brand-green-light shadow-xl relative overflow-hidden text-left">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-brand-green-light/40 blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-5 relative z-10">
              <div className="flex items-center justify-between">
                <span className="mono-tag text-[11px] text-brand-softcoral uppercase">
                  [ PLATFORM TELEMETRY ]
                </span>
                <span className="size-2 rounded-full bg-[#27c93f] animate-ping" />
              </div>

              <div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-white">
                  North Architecture
                </h3>
                <p className="mt-1.5 text-xs text-surface-greenwash/80 leading-relaxed font-sans">
                  Purpose-built autonomous agent framework with verified tool
                  execution guarantees.
                </p>
              </div>

              {/* Spec list */}
              <div className="flex flex-col gap-3 pt-2 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">CONTEXT WINDOW</span>
                  <span className="text-white font-semibold">128k Tokens</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">MULTILINGUAL</span>
                  <span className="text-white font-semibold">
                    100+ Languages
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">GROUNDING ACCURACY</span>
                  <span className="text-[#27c93f] font-semibold">
                    98.4% (MTEB #1)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">UPTIME GUARANTEE</span>
                  <span className="text-white font-semibold">99.99% SLA</span>
                </div>
              </div>
            </div>

            {/* Cloud Deploy Badges */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3 relative z-10">
              <span className="mono-tag text-[10px] text-white/50 uppercase">
                ONE-CLICK PRIVATE CLOUD DEPLOY
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-lg bg-white/10 px-2.5 py-1.5 border border-white/10 flex items-center gap-1.5">
                  <ServerIcon className="size-3 text-brand-softcoral" />
                  <span>AWS Sagemaker</span>
                </div>
                <div className="rounded-lg bg-white/10 px-2.5 py-1.5 border border-white/10 flex items-center gap-1.5">
                  <ServerIcon className="size-3 text-brand-softcoral" />
                  <span>Azure AI</span>
                </div>
                <div className="rounded-lg bg-white/10 px-2.5 py-1.5 border border-white/10 flex items-center gap-1.5">
                  <ServerIcon className="size-3 text-brand-softcoral" />
                  <span>Google Cloud</span>
                </div>
                <div className="rounded-lg bg-white/10 px-2.5 py-1.5 border border-white/10 flex items-center gap-1.5">
                  <ServerIcon className="size-3 text-brand-softcoral" />
                  <span>Oracle Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
