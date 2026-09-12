"use client";

import * as React from "react";
import {
  TerminalIcon,
  SparklesIcon,
  FileTextIcon,
  CopyIcon,
  CheckIcon,
  CpuIcon,
} from "lucide-react";

type ScenarioKey = "rag" | "tools" | "sql";

interface Citation {
  id: string;
  source: string;
  page: string;
  excerpt: string;
  score: number;
}

const scenarios = {
  rag: {
    id: "rag",
    title: "Enterprise Grounded RAG",
    model: "command-r-plus-08-2024",
    latency: "192ms",
    tokens: "1,248 tok/s",
    inputPrompt:
      "Analyze APAC vs EMEA recurring revenue growth and highlight any margin contraction risks from Q3 filings.",
    thoughtChain: [
      {
        step: "Embed 3.5 Vector Search",
        detail:
          "Querying 1.4M indexed filings across SEC EDGAR & internal ERP...",
        time: "18ms",
        status: "ok",
      },
      {
        step: "Rerank 3 Semantic Filtration",
        detail:
          "Scored 42 document chunks → Top 3 authoritative sources retained",
        time: "24ms",
        status: "ok",
      },
      {
        step: "Command R+ Citation Grounding",
        detail: "Generating 100% grounded synthesis with source attribution",
        time: "150ms",
        status: "ok",
      },
    ],
    citations: [
      {
        id: "1",
        source: "Q3-2025-Financial-Report.pdf",
        page: "p. 42",
        excerpt:
          "EMEA cloud ARR expanded +34% YoY to $214M, while gross margin stabilized at 78.4%.",
        score: 0.98,
      },
      {
        id: "2",
        source: "APAC-Regional-Review-Internal.docx",
        page: "p. 18",
        excerpt:
          "APAC ARR recorded +41% growth ($162M), with a temporary 180bps gross margin compression due to data center expansion.",
        score: 0.95,
      },
      {
        id: "3",
        source: "Treasury-Risk-Assessment.pdf",
        page: "p. 07",
        excerpt:
          "Currency hedge buffers mitigated EUR/USD volatility; APAC margin compression is projected to revert in Q4.",
        score: 0.92,
      },
    ],
    outputMarkdown:
      "EMEA recurring ARR grew **+34% YoY to $214M** with gross margins holding at **78.4%** [1]. In comparison, APAC demonstrated accelerated growth at **+41% YoY to $162M**, accompanied by a transient **180bps margin compression** driven by compute buildout in Singapore [2]. Risk analysis confirms currency hedges remain effective and margin recovery is on track for Q4 [3].",
  },
  tools: {
    id: "tools",
    title: "Multi-Step Agentic Tool Use",
    model: "command-r-plus-agentic",
    latency: "245ms",
    tokens: "940 tok/s",
    inputPrompt:
      "Audit enterprise customer #8491 (Acme Corp): check subscription tier in Salesforce, fetch latency anomalies in Datadog, and draft an SLA credit in Stripe.",
    thoughtChain: [
      {
        step: "Tool Call // salesforce.getAccount(id: '8491')",
        detail:
          "Retrieved: Acme Corp, Enterprise Tier, ARR $480k, Dedicated VPC",
        time: "32ms",
        status: "ok",
      },
      {
        step: "Tool Call // datadog.queryMetrics(host: 'vpc-acme-prod')",
        detail:
          "Found 12-min latency spike (>800ms) on 2026-09-02 exceeding 99.9% SLA",
        time: "48ms",
        status: "ok",
      },
      {
        step: "Tool Call // stripe.createCreditMemo(amount: $2,400)",
        detail:
          "Calculated 5% monthly credit ($2,400.00). Draft memo #CM-9941 created",
        time: "65ms",
        status: "ok",
      },
    ],
    citations: [
      {
        id: "1",
        source: "Salesforce CRM API",
        page: "Account 8491",
        excerpt:
          "Contract Tier: Enterprise Sovereignty / 99.99% Uptime Guarantee.",
        score: 1.0,
      },
      {
        id: "2",
        source: "Datadog Telemetry API",
        page: "Cluster 4",
        excerpt: "Outage Duration: 720s on US-East-1 Private VPC endpoint.",
        score: 1.0,
      },
    ],
    outputMarkdown:
      "Audit concluded successfully for **Acme Corp (ID: 8491)** [1]. Datadog telemetry verified a **720-second degradation** on 2026-09-02 that breached the 99.99% SLA threshold [2]. A draft SLA credit of **$2,400.00 (5% monthly contract value)** has been staged in Stripe for finance director sign-off.",
  },
  sql: {
    id: "sql",
    title: "Zero-Leak SQL Synthesis",
    model: "command-r-plus-sql",
    latency: "115ms",
    tokens: "1,420 tok/s",
    inputPrompt:
      "Generate a parameterized query for high-risk accounts with >$100k ARR and >3 open P1 Jira tickets, applying row-level RBAC.",
    thoughtChain: [
      {
        step: "Schema Grounding & RBAC Validator",
        detail:
          "Inspected enterprise PostgreSQL schema with tenant_id isolation",
        time: "12ms",
        status: "ok",
      },
      {
        step: "Synthesizing Zero-Injection SQL",
        detail:
          "Generating CTE with strict parameterized binds and index hints",
        time: "85ms",
        status: "ok",
      },
      {
        step: "Dry-Run Safety Simulator",
        detail:
          "Query plan verified: Index scan on idx_accounts_arr (Cost: 0.42..8.44)",
        time: "18ms",
        status: "ok",
      },
    ],
    citations: [
      {
        id: "1",
        source: "Enterprise Data Dictionary",
        page: "v3.2",
        excerpt:
          "Table accounts (id, name, arr, tenant_id); tickets (account_id, priority, status).",
        score: 0.99,
      },
    ],
    outputMarkdown:
      "```sql\nWITH risk_accounts AS (\n  SELECT a.id, a.name, a.arr, COUNT(t.id) AS p1_count\n  FROM accounts a\n  JOIN tickets t ON t.account_id = a.id\n  WHERE a.tenant_id = :current_tenant\n    AND a.arr >= 100000\n    AND t.priority = \P1 AND t.status != \RESOLVED\
  GROUP BY a.id, a.name, a.arr\n  HAVING COUNT(t.id) >= 3\n)\nSELECT * FROM risk_accounts ORDER BY arr DESC;\n```",
  },
};

export function AgentConsoleInteractive() {
  const [activeScenario, setActiveScenario] =
    React.useState<ScenarioKey>("rag");
  const [activeCitation, setActiveCitation] = React.useState<Citation | null>(
    null,
  );
  const [copied, setCopied] = React.useState(false);

  const scenario = scenarios[activeScenario];

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.outputMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-[22px] bg-brand-nearblack text-white shadow-2xl border border-white/10 flex flex-col">
      {/* Console Topbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 py-3 bg-[#111115] gap-3">
        {/* Terminal dots & title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-[#ff5f56]" />
            <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-xs font-medium text-white/80 tracking-wide flex items-center gap-1.5 pl-1">
            <TerminalIcon className="size-3.5 text-brand-softcoral" />
            cohere-agent-console // v3.8
          </span>
        </div>

        {/* Telemetry Status Chips */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="hidden sm:inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-white/70 border border-white/10">
            <CpuIcon className="size-3 text-brand-softcoral" />
            {scenario.model}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-brand-green/80 text-surface-greenwash px-2 py-0.5 border border-brand-green-light font-medium">
            <span className="size-1.5 rounded-full bg-[#27c93f] animate-pulse" />
            {scenario.latency}
          </span>
          <span className="hidden lg:inline-flex rounded bg-white/5 px-2 py-0.5 text-white/60 border border-white/10">
            {scenario.tokens}
          </span>
        </div>
      </div>

      {/* Interactive Scenario Selector Tabs */}
      <div className="border-b border-white/10 bg-[#15151b] px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="font-mono text-[10px] text-white/40 uppercase mr-1">
            SCENARIOS:
          </span>
          {(["rag", "tools", "sql"] as ScenarioKey[]).map((key) => {
            const sc = scenarios[key];
            const isActive = activeScenario === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveScenario(key);
                  setActiveCitation(null);
                }}
                className={`font-mono text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white text-brand-nearblack font-semibold shadow-xs"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="text-xs text-white/60 hover:text-white flex items-center gap-1 font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <CheckIcon className="size-3 text-[#27c93f]" />
          ) : (
            <CopyIcon className="size-3" />
          )}
          {copied ? "Copied" : "Copy output"}
        </button>
      </div>

      {/* Console Main Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0e0e13]">
        {/* Left Column: Input Prompt & Execution Trace */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* User Prompt Box */}
          <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-3.5 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-brand-softcoral font-medium flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-brand-coral" />
                ENTERPRISE INGESTION PROMPT
              </span>
              <span className="font-mono text-[10px] text-white/40">
                USER: ADMIN // SECURE VPC
              </span>
            </div>
            <p className="text-sm font-normal text-white/90 leading-relaxed font-sans">
              &ldquo;{scenario.inputPrompt}&rdquo;
            </p>
          </div>

          {/* Reasoning & Tool Chain */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
              [ REAL-TIME ORCHESTRATION PIPELINE ]
            </span>
            <div className="flex flex-col gap-2">
              {scenario.thoughtChain.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-white/[0.03] p-2.5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[#27c93f] text-[10px] font-mono">
                    ✓
                  </div>
                  <div className="flex flex-col flex-1 gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-white font-medium">
                        {step.step}
                      </span>
                      <span className="font-mono text-[10px] text-brand-softcoral">
                        +{step.time}
                      </span>
                    </div>
                    <span className="text-xs text-white/60 font-sans leading-snug">
                      {step.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Grounded Synthesis & Citations */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 rounded-xl bg-[#16161f] p-4 border border-white/10 flex-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-brand-softcoral" />
                <span className="font-mono text-xs font-medium text-white tracking-wide">
                  SYNTHESIS WITH PINPOINT CITATIONS
                </span>
              </div>
              <span className="font-mono text-[10px] bg-brand-green text-surface-greenwash px-2 py-0.5 rounded border border-brand-green-light">
                100% GROUNDED
              </span>
            </div>

            {/* Output Rendering with interactive Citation links */}
            <div className="text-sm leading-relaxed text-white/90 font-sans py-2">
              {activeScenario === "sql" ? (
                <pre className="p-3 rounded-lg bg-black/60 font-mono text-xs text-[#27c93f] overflow-x-auto border border-white/10">
                  {scenario.outputMarkdown
                    .replace(/```sql/g, "")
                    .replace(/```/g, "")}
                </pre>
              ) : (
                <p>
                  {activeScenario === "rag" ? (
                    <>
                      EMEA recurring ARR grew{" "}
                      <strong className="text-white font-semibold">
                        +34% YoY to $214M
                      </strong>{" "}
                      with gross margins holding at{" "}
                      <strong className="text-white font-semibold">
                        78.4%
                      </strong>{" "}
                      <button
                        onClick={() => setActiveCitation(scenario.citations[0])}
                        className="inline-flex items-center rounded bg-brand-blue/30 text-white border border-brand-blue/50 px-1.5 py-0.2 text-[11px] font-mono hover:bg-brand-blue transition-colors cursor-pointer"
                      >
                        [1]
                      </button>
                      . In comparison, APAC demonstrated accelerated growth at{" "}
                      <strong className="text-white font-semibold">
                        +41% YoY to $162M
                      </strong>
                      , accompanied by a transient{" "}
                      <strong className="text-white font-semibold">
                        180bps margin compression
                      </strong>{" "}
                      driven by compute buildout in Singapore{" "}
                      <button
                        onClick={() => setActiveCitation(scenario.citations[1])}
                        className="inline-flex items-center rounded bg-brand-blue/30 text-white border border-brand-blue/50 px-1.5 py-0.2 text-[11px] font-mono hover:bg-brand-blue transition-colors cursor-pointer"
                      >
                        [2]
                      </button>
                      . Risk analysis confirms currency hedges remain effective
                      and margin recovery is on track for Q4{" "}
                      <button
                        onClick={() => setActiveCitation(scenario.citations[2])}
                        className="inline-flex items-center rounded bg-brand-blue/30 text-white border border-brand-blue/50 px-1.5 py-0.2 text-[11px] font-mono hover:bg-brand-blue transition-colors cursor-pointer"
                      >
                        [3]
                      </button>
                      .
                    </>
                  ) : (
                    <>
                      Audit concluded successfully for{" "}
                      <strong className="text-white font-semibold">
                        Acme Corp (ID: 8491)
                      </strong>{" "}
                      <button
                        onClick={() => setActiveCitation(scenario.citations[0])}
                        className="inline-flex items-center rounded bg-brand-blue/30 text-white border border-brand-blue/50 px-1.5 py-0.2 text-[11px] font-mono hover:bg-brand-blue transition-colors cursor-pointer"
                      >
                        [1]
                      </button>
                      . Datadog telemetry verified a{" "}
                      <strong className="text-white font-semibold">
                        720-second degradation
                      </strong>{" "}
                      on 2026-09-02 that breached the 99.99% SLA threshold{" "}
                      <button
                        onClick={() => setActiveCitation(scenario.citations[1])}
                        className="inline-flex items-center rounded bg-brand-blue/30 text-white border border-brand-blue/50 px-1.5 py-0.2 text-[11px] font-mono hover:bg-brand-blue transition-colors cursor-pointer"
                      >
                        [2]
                      </button>
                      . A draft SLA credit of{" "}
                      <strong className="text-white font-semibold">
                        $2,400.00 (5% monthly contract value)
                      </strong>{" "}
                      has been staged in Stripe for finance director sign-off.
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Verified Citation Inspector */}
            <div className="mt-auto border-t border-white/10 pt-3 flex flex-col gap-2">
              <span className="font-mono text-[10px] text-white/50 uppercase">
                {activeCitation
                  ? "INSPECTING SELECTED CITATION SOURCE:"
                  : "VERIFIED ENTERPRISE SOURCES (CLICK [N] TO INSPECT):"}
              </span>

              {activeCitation ? (
                <div className="rounded-lg bg-white/10 p-2.5 border border-brand-softcoral/40 animate-fade-in flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-softcoral font-semibold flex items-center gap-1">
                      <FileTextIcon className="size-3.5" />
                      {activeCitation.source} ({activeCitation.page})
                    </span>
                    <span className="text-[#27c93f] text-[10px]">
                      Match: {(activeCitation.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-white/80 italic font-sans">
                    &ldquo;{activeCitation.excerpt}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scenario.citations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCitation(c)}
                      className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-xs flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-white/90">
                        <span className="truncate max-w-[140px] text-brand-softcoral">
                          [{c.id}] {c.source}
                        </span>
                        <span className="text-[#27c93f] text-[10px]">
                          {(c.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-[11px] text-white/60 truncate font-sans">
                        {c.excerpt}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/10 bg-[#0b0b0e] px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-white/50 gap-2">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#27c93f]" />
          Zero Data Retention Active // VPC Isolation Enforced
        </span>
        <a
          href="#models"
          className="text-white hover:text-brand-softcoral underline underline-offset-4 transition-colors"
        >
          View Command R+ API reference →
        </a>
      </div>
    </div>
  );
}
