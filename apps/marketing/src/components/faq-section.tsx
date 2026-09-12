"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "item-1",
    question:
      "How does Cohere guarantee zero data retention for enterprise customers?",
    answer:
      "Enterprise contracts include strict Zero Data Retention (ZDR) clauses. When using our managed enterprise endpoints or private VPC deployments, your prompt tokens, completion data, and vector embeddings are processed strictly in volatile memory and never persisted to disk, cached for model fine-tuning, or exposed to third parties.",
  },
  {
    id: "item-2",
    question:
      "Can we deploy Command R+ and Embed 3 in our own air-gapped private VPC?",
    answer:
      "Yes. Cohere models are available as managed containers for one-click deployment inside your private VPC on AWS (SageMaker), Microsoft Azure (Azure AI), Google Cloud (Vertex AI), and Oracle Cloud Infrastructure (OCI). We also support fully air-gapped on-premise Kubernetes clusters for defense, government, and financial sector clients.",
  },
  {
    id: "item-3",
    question: "How does Rerank 3 integrate with our existing vector database?",
    answer:
      "Rerank 3 requires zero re-indexing or database migration. You simply fetch top-50 or top-100 candidate documents from your existing search stack (e.g. Pinecone, Elasticsearch, Qdrant, Milvus, Postgres pgvector) and pass them through our single rerank API endpoint. Rerank 3 applies deep cross-attention to score semantic relevance in under 15ms, boosting search accuracy by over 40%.",
  },
  {
    id: "item-4",
    question:
      "How does Command R+ handle citations and prevent hallucinations?",
    answer:
      "Command R+ is uniquely trained with citation grounding as a fundamental objective. Instead of generating text and guessing references post-hoc, the model produces exact character-precise citations mapped directly to supplied source passages during token generation. If an answer cannot be verified by the provided context, the model explicitly flags lack of evidence.",
  },
  {
    id: "item-5",
    question:
      "What tool use protocols and schemas are supported for autonomous agents?",
    answer:
      "Cohere North agent framework supports OpenAPI schemas, JSON schemas, SQL dialect generators, and custom TypeScript/Python functions. The model can orchestrate parallel tool executions, automatically parse parameters, and execute multi-turn verification loops with robust error handling.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="w-full bg-surface-stone/40 py-20 sm:py-28 border-b border-hairline"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-hairline bg-white px-3.5 py-1 text-xs font-mono text-ink uppercase"
          >
            [ ARCHITECTURE & SECURITY FAQ ]
          </Badge>
          <h2 className="product-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink">
            Frequently Asked Technical Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-custom max-w-xl font-sans leading-relaxed">
            Detailed answers on model architecture, latency benchmarks, private
            cloud compliance, and RAG integration.
          </p>
        </div>

        <div className="mt-12">
          <Accordion className="w-full bg-white rounded-2xl border border-hairline shadow-xs">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="font-sans text-base font-medium text-ink px-6 py-5 hover:text-brand-blue">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm text-slate-custom leading-relaxed px-6 pb-6 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
