"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";

export function ContactSection() {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="w-full bg-surface-greenwash py-20 sm:py-28 border-b border-hairline relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Security Callouts */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-brand-green/30 bg-white/80 px-3.5 py-1 text-xs font-mono text-brand-green uppercase"
            >
              [ ENTERPRISE ACCESS & ARCHITECTURE ]
            </Badge>

            <h2 className="product-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink">
              Deploy sovereign AI in your private perimeter.
            </h2>

            <p className="text-base text-ink/80 font-sans leading-relaxed">
              Connect with our enterprise solution architects to explore
              dedicated VPC deployments, benchmark custom models, and review our
              SOC 2 Type II audit.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3 pt-2 font-sans text-sm text-ink/90">
              <div className="flex items-start gap-2.5">
                <CheckCircle2Icon className="size-4 text-brand-green shrink-0 mt-0.5" />
                <span>Dedicated solution architect & SLA onboarding</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2Icon className="size-4 text-brand-green shrink-0 mt-0.5" />
                <span>
                  Zero Data Retention (ZDR) guarantee & enterprise BAA
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2Icon className="size-4 text-brand-green shrink-0 mt-0.5" />
                <span>
                  Proof of concept deployment on AWS, Azure, GCP, or OCI
                </span>
              </div>
            </div>

            {/* Quote block */}
            <div className="p-4 rounded-xl bg-white/60 border border-brand-green/20 text-xs font-mono text-slate-custom">
              &ldquo;Cohere provided the exact combination of state-of-the-art
              retrieval accuracy and sovereign cloud isolation our compliance
              team required.&rdquo;
            </div>
          </div>

          {/* Right Column: Contact Form Card matching CORE-UI.md 22px radius */}
          <div className="lg:col-span-7">
            <div className="rounded-[22px] bg-white p-7 sm:p-10 border border-hairline shadow-lg">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-4 animate-fade-in">
                  <div className="flex size-14 items-center justify-center rounded-full bg-surface-greenwash text-brand-green border border-brand-green/30">
                    <CheckCircle2Icon className="size-8" />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-ink">
                    Enterprise Request Received
                  </h3>
                  <p className="text-sm text-slate-custom max-w-md font-sans">
                    A Cohere Enterprise Solutions Architect will reach out
                    within 2 hours to coordinate your private architecture
                    review and VPC staging.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="rounded-4xl mt-4 text-xs font-mono"
                  >
                    Submit another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="border-b border-hairline pb-4">
                    <h3 className="font-display text-2xl font-medium text-ink">
                      Request an Enterprise Demo
                    </h3>
                    <p className="text-xs text-muted-slate font-sans mt-1">
                      Fill out the details below and our team will get in touch
                      shortly.
                    </p>
                  </div>

                  <FieldGroup className="flex flex-col gap-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel
                          htmlFor="firstName"
                          className="text-xs font-mono uppercase text-slate-custom"
                        >
                          First Name *
                        </FieldLabel>
                        <Input
                          id="firstName"
                          required
                          placeholder="Jane"
                          className="h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg"
                        />
                      </Field>
                      <Field>
                        <FieldLabel
                          htmlFor="lastName"
                          className="text-xs font-mono uppercase text-slate-custom"
                        >
                          Last Name *
                        </FieldLabel>
                        <Input
                          id="lastName"
                          required
                          placeholder="Doe"
                          className="h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg"
                        />
                      </Field>
                    </div>

                    {/* Work Email & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel
                          htmlFor="email"
                          className="text-xs font-mono uppercase text-slate-custom"
                        >
                          Work Email *
                        </FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="jane@enterprise.com"
                          className="h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg"
                        />
                      </Field>
                      <Field>
                        <FieldLabel
                          htmlFor="company"
                          className="text-xs font-mono uppercase text-slate-custom"
                        >
                          Company Name *
                        </FieldLabel>
                        <Input
                          id="company"
                          required
                          placeholder="Acme Global Inc."
                          className="h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg"
                        />
                      </Field>
                    </div>

                    {/* Cloud Target & Primary Use Case */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="text-xs font-mono uppercase text-slate-custom">
                          Preferred Deployment Target *
                        </FieldLabel>
                        <Select defaultValue="aws">
                          <SelectTrigger className="w-full h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg">
                            <SelectValue placeholder="Select cloud..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              <SelectItem value="aws">
                                AWS SageMaker VPC
                              </SelectItem>
                              <SelectItem value="azure">
                                Microsoft Azure AI
                              </SelectItem>
                              <SelectItem value="gcp">
                                Google Cloud Vertex AI
                              </SelectItem>
                              <SelectItem value="oci">
                                Oracle Cloud (OCI)
                              </SelectItem>
                              <SelectItem value="onprem">
                                On-Prem Air-Gapped K8s
                              </SelectItem>
                              <SelectItem value="managed">
                                Cohere Managed Cloud
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel className="text-xs font-mono uppercase text-slate-custom">
                          Primary Workload *
                        </FieldLabel>
                        <Select defaultValue="rag">
                          <SelectTrigger className="w-full h-10 text-sm bg-surface-stone/30 border-hairline rounded-lg">
                            <SelectValue placeholder="Select workload..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              <SelectItem value="rag">
                                Enterprise Grounded RAG
                              </SelectItem>
                              <SelectItem value="agents">
                                Multi-Step Autonomous Agents
                              </SelectItem>
                              <SelectItem value="search">
                                Embeddings & Search Rerank
                              </SelectItem>
                              <SelectItem value="finetune">
                                Private Model Fine-Tuning
                              </SelectItem>
                              <SelectItem value="other">
                                General Enterprise AI
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    {/* Message */}
                    <Field>
                      <FieldLabel
                        htmlFor="notes"
                        className="text-xs font-mono uppercase text-slate-custom"
                      >
                        Project Scope or Architecture Notes (Optional)
                      </FieldLabel>
                      <Textarea
                        id="notes"
                        rows={3}
                        placeholder="Describe your data volume, latency constraints, or compliance requirements..."
                        className="text-sm bg-surface-stone/30 border-hairline rounded-lg"
                      />
                    </Field>
                  </FieldGroup>

                  {/* Submit Button matching CORE-UI.md button-primary */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-4xl bg-brand-nearblack text-white hover:bg-brand-nearblack/90 h-11 text-sm font-medium justify-center flex items-center gap-2 shadow-xs"
                    >
                      Request Enterprise Architecture Review
                      <ArrowRightIcon className="size-4" />
                    </Button>
                    <p className="mt-3 text-center text-[11px] text-muted-slate font-sans">
                      By submitting, you agree to our Enterprise Terms of
                      Service and Privacy Policy. We respect strict data
                      confidentiality.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
