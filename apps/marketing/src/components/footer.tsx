"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";

export function Footer() {
  const [subscribed, setSubscribed] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-brand-nearblack text-white pt-16 pb-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        {/* Newsletter Subscription Block matching CORE-UI.md footer-newsletter */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="mono-tag text-xs text-brand-coral font-semibold uppercase tracking-wider">
              [ AI MOVES FAST ]
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
              Subscribe to Cohere Research and Model Updates.
            </h3>
            <p className="text-xs text-muted-slate font-sans leading-relaxed">
              Get peer-reviewed whitepapers, frontier benchmark breakthroughs,
              and enterprise release notes directly in your inbox.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px]">
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-[#27c93f] bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2Icon className="size-4" />
                <span>Subscription confirmed. Welcome to Cohere Research.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-2"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your enterprise email..."
                  className="h-11 rounded-4xl bg-white/10 border-white/15 text-white placeholder:text-muted-slate text-xs font-mono px-4 min-w-[240px]"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full size-11 bg-white text-brand-nearblack hover:bg-white/90 shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRightIcon className="size-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-sans">
          {/* Col 1: Foundation Models */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider">
              Foundation Models
            </span>
            <ul className="flex flex-col gap-2 text-muted-slate">
              <li>
                <a
                  href="#models"
                  className="hover:text-white transition-colors"
                >
                  Command R+ (104B)
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  className="hover:text-white transition-colors"
                >
                  Command R (35B)
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  className="hover:text-white transition-colors"
                >
                  Embed 3.5 Multilingual
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  className="hover:text-white transition-colors"
                >
                  Rerank 3 Relevance Engine
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  className="hover:text-white transition-colors"
                >
                  Fine-Tuning API
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Enterprise Solutions */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider">
              Enterprise Solutions
            </span>
            <ul className="flex flex-col gap-2 text-muted-slate">
              <li>
                <a
                  href="#capabilities"
                  className="hover:text-white transition-colors"
                >
                  Enterprise Grounded RAG
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  className="hover:text-white transition-colors"
                >
                  North Autonomous Agents
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-white transition-colors"
                >
                  Private VPC Deployment
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-white transition-colors"
                >
                  Zero Data Retention (ZDR)
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-white transition-colors"
                >
                  Financial Services & Defense
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Developers */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider">
              Research & Developers
            </span>
            <ul className="flex flex-col gap-2 text-muted-slate">
              <li>
                <a
                  href="#research"
                  className="hover:text-white transition-colors"
                >
                  Research Publications
                </a>
              </li>
              <li>
                <a
                  href="#research"
                  className="hover:text-white transition-colors"
                >
                  MTEB Multilingual Benchmarks
                </a>
              </li>
              <li>
                <a
                  href="#interactive-console"
                  className="hover:text-white transition-colors"
                >
                  Cohere Playground
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  className="hover:text-white transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#research"
                  className="hover:text-white transition-colors"
                >
                  Aya Multilingual Project
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Governance */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider">
              Company & Trust
            </span>
            <ul className="flex flex-col gap-2 text-muted-slate">
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  About Cohere
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Leadership & Careers
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-white transition-colors"
                >
                  Trust Center & SOC 2
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Security Whitepaper
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & DPA
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Operational Status & Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-slate">
          <div className="flex items-center gap-3">
            <div className="flex size-6 items-center justify-center rounded bg-white/10 text-white font-bold text-xs">
              c:
            </div>
            <span>
              © {new Date().getFullYear()} Cohere Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded bg-white/5 px-3 py-1 border border-white/10 text-white/80">
              <span className="size-2 rounded-full bg-[#27c93f] animate-pulse" />
              <span>All Systems Operational (99.998% SLA)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
