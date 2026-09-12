import * as React from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { TrustLogoStrip } from "@/components/trust-logo-strip";
import { CapabilitiesBand } from "@/components/capabilities-band";
import { ProductCards } from "@/components/product-cards";
import { ResearchTable } from "@/components/research-table";
import { EnterpriseSecurityBand } from "@/components/enterprise-security-band";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand-coral selection:text-white">
      {/* Announcement Strip */}
      <AnnouncementBar />

      {/* Global Navigation */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section with Dual Media & Interactive Agent Console */}
        <HeroSection />

        {/* Quiet Monochrome Trust Logos */}
        <TrustLogoStrip />

        {/* Deep Enterprise Green Capability Band */}
        <CapabilitiesBand />

        {/* Foundation Models on Warm Stone Surface */}
        <ProductCards />

        {/* Research Publication & Benchmark Table */}
        <ResearchTable />

        {/* Dark Navy Security & Data Sovereignty Band */}
        <EnterpriseSecurityBand />

        {/* Technical FAQ Accordion */}
        <FaqSection />

        {/* Enterprise Demo Form on Pale Green Wash */}
        <ContactSection />
      </main>

      {/* Global Footer with Newsletter */}
      <Footer />
    </div>
  );
}
