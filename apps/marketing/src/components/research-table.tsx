"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRightIcon } from "lucide-react";

type CategoryFilter = "all" | "rag" | "llm" | "agents" | "efficiency";

interface Paper {
  id: string;
  date: string;
  category: "rag" | "llm" | "agents" | "efficiency";
  categoryLabel: string;
  categoryColor: "coral" | "blue" | "stone";
  title: string;
  abstract: string;
  metric: string;
  link: string;
}

const papers: Paper[] = [
  {
    id: "CR-048",
    date: "2026.08",
    category: "rag",
    categoryLabel: "RAG & RETRIEVAL",
    categoryColor: "coral",
    title:
      "Command R+: Grounded Generation and Multi-Hop Citations in Enterprise Scale Documents",
    abstract:
      "Introducing an architectural paradigm for zero-hallucination document synthesis with character-precise token attribution.",
    metric: "98.4% Grounding Accuracy",
    link: "#",
  },
  {
    id: "CR-047",
    date: "2026.07",
    category: "llm",
    categoryLabel: "FOUNDATION MODELS",
    categoryColor: "blue",
    title: "Scalable Post-Training Alignment with Constrained Tool Invariants",
    abstract:
      "A methodology for training 100B+ parameter models on verifiable tool orchestration without catastrophic forgetfulness.",
    metric: "94.2% Multi-Tool Success",
    link: "#",
  },
  {
    id: "CR-046",
    date: "2026.05",
    category: "efficiency",
    categoryLabel: "EFFICIENCY & QUANT",
    categoryColor: "stone",
    title:
      "Embed 3.5: Compressed Matryoshka Binary Embeddings for Billion-Scale Vector Search",
    abstract:
      "Achieving #1 multilingual retrieval on MTEB while compressing vector memory footprint by 32x through 1-bit quantization.",
    metric: "MTEB Multilingual #1",
    link: "#",
  },
  {
    id: "CR-045",
    date: "2026.04",
    category: "agents",
    categoryLabel: "AGENTIC TOOL USE",
    categoryColor: "coral",
    title:
      "North: A Sovereign Multi-Agent Execution Framework for Air-Gapped Enterprise Clusters",
    abstract:
      "Designing deterministic coordination protocols between fine-tuned specialist models under strict latency budgets.",
    metric: "180ms P95 Agent Turn",
    link: "#",
  },
  {
    id: "CR-044",
    date: "2026.02",
    category: "rag",
    categoryLabel: "RAG & RETRIEVAL",
    categoryColor: "coral",
    title:
      "Rerank 3: Cross-Encoder Relevance Scoring on Heterogeneous Tabular and Unstructured Corpi",
    abstract:
      "Evaluating cross-attention reranking architectures across 100 enterprise domains with massive gain over dense-only search.",
    metric: "+42% MRR@10 Gain",
    link: "#",
  },
];

export function ResearchTable() {
  const [filter, setFilter] = React.useState<CategoryFilter>("all");

  const filteredPapers = React.useMemo(() => {
    if (filter === "all") return papers;
    return papers.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="research"
      className="w-full bg-background py-20 sm:py-28 border-b border-hairline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-hairline">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-hairline bg-surface-stone/70 px-3.5 py-1 text-xs font-mono text-ink uppercase"
            >
              [ COHERE RESEARCH // TECHNICAL RELEASES ]
            </Badge>
            <h2 className="product-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink">
              Open scientific contributions & technical benchmarks.
            </h2>
          </div>
          <p className="text-sm text-slate-custom max-w-md font-sans leading-relaxed">
            Our researchers publish reproducible results on multilingual
            foundation models, grounded retrieval, and efficient neural search.
          </p>
        </div>

        {/* Filter Pills Bar matching CORE-UI.md button-pill-outline */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
              filter === "all"
                ? "bg-brand-nearblack text-white border-brand-nearblack font-semibold"
                : "bg-transparent text-ink/80 border-hairline hover:border-ink hover:text-ink"
            }`}
          >
            ALL PAPERS ({papers.length})
          </button>
          <button
            onClick={() => setFilter("rag")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
              filter === "rag"
                ? "bg-brand-coral text-white border-brand-coral font-semibold"
                : "bg-transparent text-brand-coral border-brand-coral/40 hover:border-brand-coral"
            }`}
          >
            RAG & RETRIEVAL
          </button>
          <button
            onClick={() => setFilter("llm")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
              filter === "llm"
                ? "bg-brand-blue text-white border-brand-blue font-semibold"
                : "bg-transparent text-brand-blue border-brand-blue/40 hover:border-brand-blue"
            }`}
          >
            FOUNDATION MODELS
          </button>
          <button
            onClick={() => setFilter("agents")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
              filter === "agents"
                ? "bg-brand-nearblack text-white border-brand-nearblack font-semibold"
                : "bg-transparent text-ink/80 border-hairline hover:border-ink hover:text-ink"
            }`}
          >
            AGENTIC TOOL USE
          </button>
          <button
            onClick={() => setFilter("efficiency")}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
              filter === "efficiency"
                ? "bg-brand-nearblack text-white border-brand-nearblack font-semibold"
                : "bg-transparent text-ink/80 border-hairline hover:border-ink hover:text-ink"
            }`}
          >
            EFFICIENCY & QUANT
          </button>
        </div>

        {/* Research Publication Table matching CORE-UI.md research-table */}
        <div className="mt-8 rounded-xl border border-hairline overflow-hidden bg-white shadow-xs">
          <Table>
            <TableHeader className="bg-surface-stone/40 border-b border-hairline font-mono text-[11px] uppercase text-slate-custom">
              <TableRow>
                <TableHead className="w-[120px] py-3.5 pl-6">
                  DATE // ID
                </TableHead>
                <TableHead className="py-3.5">PAPER TITLE & ABSTRACT</TableHead>
                <TableHead className="w-[180px] py-3.5 hidden sm:table-cell">
                  CATEGORY
                </TableHead>
                <TableHead className="w-[180px] py-3.5 hidden md:table-cell">
                  KEY BENCHMARK
                </TableHead>
                <TableHead className="w-[110px] py-3.5 pr-6 text-right">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPapers.map((paper) => (
                <TableRow
                  key={paper.id}
                  className="border-b border-hairline/80 hover:bg-surface-stone/20 transition-colors py-4"
                >
                  {/* Date & ID */}
                  <TableCell className="font-mono text-xs text-muted-slate pl-6 align-top pt-5">
                    <div>{paper.date}</div>
                    <div className="text-[10px] text-slate-custom uppercase font-semibold">
                      {paper.id}
                    </div>
                  </TableCell>

                  {/* Title & Abstract */}
                  <TableCell className="align-top py-5 pr-4">
                    <div className="flex flex-col gap-1">
                      <a
                        href={paper.link}
                        className="font-sans font-medium text-ink hover:text-brand-blue transition-colors text-sm sm:text-base leading-snug"
                      >
                        {paper.title}
                      </a>
                      <p className="text-xs text-slate-custom font-sans leading-relaxed line-clamp-2 max-w-2xl">
                        {paper.abstract}
                      </p>
                    </div>
                  </TableCell>

                  {/* Category Chip */}
                  <TableCell className="align-top py-5 hidden sm:table-cell">
                    <span
                      className={`inline-block font-mono text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                        paper.categoryColor === "coral"
                          ? "bg-brand-softcoral/20 text-brand-coral border-brand-coral/40"
                          : paper.categoryColor === "blue"
                            ? "bg-brand-blue/10 text-brand-blue border-brand-blue/30"
                            : "bg-surface-stone text-ink border-hairline"
                      }`}
                    >
                      {paper.categoryLabel}
                    </span>
                  </TableCell>

                  {/* Benchmark Metric */}
                  <TableCell className="align-top py-5 hidden md:table-cell font-mono text-xs">
                    <span className="font-semibold text-brand-green bg-surface-greenwash px-2 py-0.5 rounded border border-brand-green/20">
                      {paper.metric}
                    </span>
                  </TableCell>

                  {/* External Link */}
                  <TableCell className="align-top py-5 pr-6 text-right">
                    <a
                      href={paper.link}
                      className="inline-flex items-center gap-1 font-mono text-xs text-brand-blue hover:text-brand-blue-hover underline underline-offset-4"
                    >
                      PDF
                      <ArrowUpRightIcon className="size-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
