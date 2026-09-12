"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

export function ProductCards() {
  const models = [
    {
      id: "command-r-plus",
      tag: "FLAGSHIP // REASONING & RAG",
      name: "Command R+",
      headline:
        "Frontier LLM engineered for complex reasoning and enterprise RAG.",
      badge: "UPDATED V08-2024",
      specs: [
        { label: "Context Window", value: "128k Tokens" },
        { label: "Multilingual", value: "100+ Languages" },
        { label: "Grounded Citation", value: "Native / 100%" },
        { label: "Deployment", value: "Private Cloud & VPC" },
      ],
      features: [
        "State-of-the-art grounded RAG synthesis",
        "Autonomous multi-step tool use & API chaining",
        "Guaranteed structured JSON schema outputs",
        "Zero data retention & sovereign VPC isolation",
      ],
      primaryAction: "Request model access",
      secondaryAction: "View benchmarks →",
    },
    {
      id: "embed-3",
      tag: "DENSE RETRIEVAL // VECTOR SEARCH",
      name: "Embed 3.5",
      headline:
        "The global benchmark for multilingual and multimodal embeddings.",
      badge: "MTEB #1 RANKED",
      specs: [
        { label: "Dimensions", value: "1024 / 512 / 256" },
        { label: "Compression", value: "Binary & Int8" },
        { label: "Cost Reduction", value: "Up to 70%" },
        { label: "Modality", value: "Text & Image" },
      ],
      features: [
        "#1 on MTEB multilingual retrieval benchmark",
        "Matryoshka representation learning support",
        "Native binary quantization for massive vector scale",
        "Handles messy real-world noisy enterprise PDFs",
      ],
      primaryAction: "Deploy Embed 3.5",
      secondaryAction: "Explore MTEB paper →",
    },
    {
      id: "rerank-3",
      tag: "SEARCH RELEVANCE // 10X PRECISION",
      name: "Rerank 3",
      headline: "Semantic relevance layer that supercharges any search engine.",
      badge: "LOW LATENCY",
      specs: [
        { label: "Latency", value: "<15ms / 100 docs" },
        { label: "Integration", value: "Single API call" },
        { label: "Compatibility", value: "Any Vector DB / SQL" },
        { label: "Accuracy Lift", value: "+42% Relevance" },
      ],
      features: [
        "Drop-in 2-line code upgrade to existing search stacks",
        "Compatible with Elasticsearch, Pinecone, Qdrant, Milvus",
        "Zero re-indexing or database migration needed",
        "Complex tabular & cross-document semantic understanding",
      ],
      primaryAction: "Deploy Rerank 3",
      secondaryAction: "Read integration guide →",
    },
  ];

  return (
    <section
      id="models"
      className="w-full bg-surface-stone py-20 sm:py-28 border-y border-hairline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-slate-custom/30 bg-white/80 px-3.5 py-1 text-xs font-mono text-ink uppercase"
          >
            [ PRODUCTION FOUNDATION SUITE // ENTERPRISE READY ]
          </Badge>
          <h2 className="product-headline text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-ink text-balance">
            Frontier models designed for mission-critical accuracy.
          </h2>
          <p className="text-base sm:text-lg text-ink/75 font-normal leading-relaxed font-sans mt-2">
            Every model is optimized for high throughput, verifiable
            truthfulness, and private deployment inside your security boundary.
          </p>
        </div>

        {/* 3-Column Product Cards Grid matching CORE-UI.md 8px radius */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="rounded-[8px] bg-white border border-hairline p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-5">
                {/* Tag & Badge */}
                <div className="flex items-center justify-between">
                  <span className="mono-tag text-[11px] text-slate-custom font-medium">
                    {model.tag}
                  </span>
                  <span className="font-mono text-[10px] bg-surface-greenwash text-brand-green px-2 py-0.5 rounded border border-brand-green/20 font-semibold">
                    {model.badge}
                  </span>
                </div>

                {/* Model Title & Description */}
                <div>
                  <h3 className="font-display text-3xl font-medium tracking-tight text-ink">
                    {model.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink/75 font-sans leading-relaxed">
                    {model.headline}
                  </p>
                </div>

                {/* Spec Key-Value Matrix */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-md bg-surface-stone/50 border border-hairline/60 font-mono text-xs">
                  {model.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex flex-col">
                      <span className="text-[10px] text-slate-custom uppercase">
                        {spec.label}
                      </span>
                      <span className="text-ink font-semibold mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-hairline" />

                {/* Checkmark Bullets */}
                <div className="flex flex-col gap-2.5">
                  <span className="mono-tag text-[10px] text-slate-custom uppercase">
                    CAPABILITY HIGHLIGHTS:
                  </span>
                  {model.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2 text-xs text-ink/90 font-sans"
                    >
                      <CheckIcon className="size-3.5 text-brand-green shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-5 border-t border-hairline flex flex-col gap-3">
                <Button
                  nativeButton={false}
                  render={<a href="#contact" />}
                  className="w-full rounded-4xl bg-brand-nearblack text-white hover:bg-brand-nearblack/90 h-10 text-xs font-medium justify-center flex items-center gap-1.5 shadow-xs"
                >
                  {model.primaryAction}
                  <ArrowRightIcon className="size-3.5" />
                </Button>
                <a
                  href="#research"
                  className="text-center text-xs font-medium text-brand-blue hover:text-brand-blue-hover underline underline-offset-4 transition-colors"
                >
                  {model.secondaryAction}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
