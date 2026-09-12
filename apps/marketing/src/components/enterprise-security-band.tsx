"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheckIcon,
  LockIcon,
  ServerIcon,
  ArrowRightIcon,
  CpuIcon,
} from "lucide-react";

export function EnterpriseSecurityBand() {
  const pillars = [
    {
      icon: LockIcon,
      tag: "TRUST // 01",
      title: "Zero Data Retention",
      description:
        "Contractually guaranteed data isolation. Your enterprise inputs, embeddings, and generated responses are never cached, logged, or used for model training.",
      badge: "STRICT BAA & DPA",
    },
    {
      icon: ServerIcon,
      tag: "TRUST // 02",
      title: "Multi-Cloud Private VPC",
      description:
        "Deploy inside your existing security boundary on AWS SageMaker, Microsoft Azure, Google Cloud, or air-gapped on-premise Kubernetes clusters.",
      badge: "AIR-GAPPED COMPATIBLE",
    },
    {
      icon: ShieldCheckIcon,
      tag: "TRUST // 03",
      title: "SOC 2 Type II & HIPAA",
      description:
        "Rigorously audited enterprise controls. End-to-end TLS 1.3 encryption in transit, AES-256 at rest, and granular role-based access control (RBAC).",
      badge: "INDEPENDENTLY AUDITED",
    },
    {
      icon: CpuIcon,
      tag: "TRUST // 04",
      title: "Private Weight Fine-Tuning",
      description:
        "Fine-tune Command and Embed on proprietary corporate lexicons and ontologies with isolated adapter weights owned completely by your organization.",
      badge: "IP SOVEREIGNTY",
    },
  ];

  return (
    <section
      id="security"
      className="w-full bg-brand-navy text-white py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-white/20 bg-white/5 px-3.5 py-1 text-xs font-mono text-brand-softcoral uppercase"
            >
              [ DATA SOVEREIGNTY // INFRASTRUCTURE SECURITY ]
            </Badge>
            <h2 className="product-headline text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white text-balance">
              Total data ownership. Zero data retention.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/75 max-w-md font-sans leading-relaxed">
            Cohere is engineered from first principles for sovereign enterprise
            intelligence with air-gapped deployment guarantees.
          </p>
        </div>

        {/* 4 Trust Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0b1f35]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-white/25 hover:bg-[#0e253e] transition-all shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-brand-softcoral border border-white/10">
                      <Icon className="size-4" />
                    </div>
                    <span className="font-mono text-[10px] text-white/50">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-medium text-white">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <span className="font-mono text-[10px] bg-white/10 text-brand-softcoral px-2 py-0.5 rounded border border-white/10 font-medium">
                    {pillar.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Security Certifications Row */}
        <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              ENTERPRISE COMPLIANCE & GOVERNANCE READY
            </span>
            <span className="text-xs text-white/60 font-sans">
              Download our latest SOC 2 Type II audit report, HIPAA whitepaper,
              and security architecture brief.
            </span>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#contact" />}
            className="rounded-4xl border-white/20 text-white hover:bg-white/10 h-10 px-5 text-xs font-mono inline-flex items-center gap-2"
          >
            Request Security Whitepaper
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
