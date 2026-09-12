"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, TerminalIcon } from "lucide-react";

export function CapabilitiesBand() {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const capabilities = [
    {
      tag: "CAPABILITY // 01",
      title: "Enterprise Grounded RAG",
      description:
        "Direct document grounding that eliminates hallucination risk. Every generated insight links to verifiable internal enterprise records with confidence scores.",
      features: [
        "Automatic fine-grained document chunking & vector indexing",
        "Multi-document synthesis with exact character-level citations",
        "Supports complex PDFs, spreadsheets, scans, and messy unstructured data",
      ],
      codeSnippet: `// Cohere Grounded RAG API
const response = await cohere.chat({
  model: "command-r-plus-08-2024",
  message: "Summarize Q3 financial variance for APAC",
  documents: enterpriseInternalFilings,
  citationQuality: "accurate",
});

console.log(response.text);
console.log(response.citations); // 100% verified source references`,
    },
    {
      tag: "CAPABILITY // 02",
      title: "Autonomous Multi-Step Tool Use",
      description:
        "Orchestrate complex business logic across internal APIs, SQL engines, and SaaS tools with structured parameter execution and rollback safety.",
      features: [
        "Native support for 100+ tool schemas in a single prompt",
        "Parallel tool calling with dry-run verification mode",
        "Automated error recovery and parameter correction loops",
      ],
      codeSnippet: `// Multi-Step Agentic Tool Calling
const agent = await cohere.agent({
  model: "command-r-plus-agentic",
  tools: [salesforceCRM, sapERP, datadogTelemetry, stripeBilling],
  prompt: "Audit customer #8491 latency breach and draft SLA credit",
});

const executionLog = await agent.run();
console.log(executionLog.steps); // [CRM Query -> Telemetry -> Draft PO]`,
    },
    {
      tag: "CAPABILITY // 03",
      title: "Embed 3.5 & Semantic Rerank",
      description:
        "The global standard for dense retrieval and search relevance. Compress vectors into binary embeddings with zero drop in accuracy.",
      features: [
        "#1 on MTEB multilingual retrieval benchmark (100+ languages)",
        "Compressed binary vectors save up to 70% in vector DB hosting costs",
        "Rerank 3 drops directly into Pinecone, Qdrant, Milvus, and Elasticsearch",
      ],
      codeSnippet: `// Rerank 3 Retrieval Optimization
const reranked = await cohere.rerank({
  model: "rerank-v3.5",
  query: "Contractual liabilities in cross-border acquisitions",
  documents: vectorDbInitialCandidates,
  topN: 3,
});

console.log(reranked.results); // Precision boosted from 64% to 98.4%`,
    },
  ];

  return (
    <section
      id="capabilities"
      className="relative w-full bg-brand-green text-white py-20 sm:py-28 overflow-hidden"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-brand-green-light bg-brand-green-dark/80 px-3.5 py-1 text-xs font-mono text-brand-softcoral uppercase"
          >
            [ PLATFORM CAPABILITIES // ENTERPRISE ARCHITECTURE ]
          </Badge>
          <h2 className="product-headline text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white text-balance">
            Engineered for complex workflows and proprietary data.
          </h2>
          <p className="text-base sm:text-lg text-surface-greenwash/80 font-normal leading-relaxed font-sans">
            Built from the ground up for mission-critical enterprise workloads
            where hallucinations, data leakage, and compliance failures are not
            an option.
          </p>
        </div>

        {/* 3 Capability Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const isSelected = activeTab === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#002822] border-brand-softcoral/60 shadow-xl ring-1 ring-brand-softcoral/40"
                    : "bg-[#002f28]/70 border-white/10 hover:border-white/25 hover:bg-[#002f28]"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="mono-tag text-[11px] text-brand-softcoral font-medium">
                      {item.tag}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[10px] bg-brand-softcoral text-brand-nearblack px-2 py-0.5 rounded font-semibold">
                        ACTIVE PREVIEW
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl font-normal text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-surface-greenwash/80 leading-relaxed font-sans">
                    {item.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                    {item.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2 text-xs text-white/90"
                      >
                        <CheckCircle2Icon className="size-3.5 text-[#27c93f] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-softcoral hover:text-white transition-colors">
                    Click to inspect code API →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Capability Code Deep-Dive Box */}
        <div className="mt-10 rounded-2xl bg-[#001f1b] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-3">
            <div className="flex items-center gap-2">
              <TerminalIcon className="size-4 text-brand-softcoral" />
              <span className="font-mono text-sm font-medium text-white">
                API IMPLEMENTATION // {capabilities[activeTab].title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">
                TypeScript SDK v7.12
              </span>
              <a
                href="#contact"
                className="font-mono text-xs text-brand-softcoral hover:underline ml-2"
              >
                View Full Documentation →
              </a>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-surface-greenwash leading-relaxed p-4 rounded-xl bg-black/40 border border-white/5">
              <code>{capabilities[activeTab].codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
