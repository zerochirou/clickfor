"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-hairline shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          : "bg-background border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Zone: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-brand-nearblack text-white font-mono font-bold text-xs">
              c:
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-ink group-hover:text-black transition-colors">
              cohere
            </span>
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-widest text-slate-custom bg-surface-stone px-2 py-0.5 rounded-sm">
            ENTERPRISE
          </span>
        </div>

        {/* Center Zone: Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-normal text-ink">
          {/* Models Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="inline-flex items-center gap-1 px-3 py-2 text-sm text-ink/80 hover:text-ink transition-colors outline-none cursor-pointer">
                  Models
                  <ChevronDownIcon className="size-3.5 text-muted-slate" />
                </button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 p-2 bg-white rounded-xl shadow-xl border border-hairline"
            >
              <DropdownMenuLabel className="mono-tag text-[10px] text-muted-slate px-2 py-1.5">
                FRONTIER INTELLIGENCE
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <a
                      href="#models"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-surface-stone/60 transition-colors"
                    >
                      <span className="font-medium text-ink flex items-center gap-1.5">
                        Command R+
                        <span className="font-mono text-[10px] bg-brand-softcoral/30 text-brand-coral px-1.5 rounded">
                          NEW
                        </span>
                      </span>
                      <span className="text-xs text-muted-slate">
                        Frontier reasoning & enterprise RAG
                      </span>
                    </a>
                  }
                />
                <DropdownMenuItem
                  render={
                    <a
                      href="#models"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-surface-stone/60 transition-colors"
                    >
                      <span className="font-medium text-ink">Embed 3.5</span>
                      <span className="text-xs text-muted-slate">
                        Industry-leading multilingual embeddings
                      </span>
                    </a>
                  }
                />
                <DropdownMenuItem
                  render={
                    <a
                      href="#models"
                      className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-surface-stone/60 transition-colors"
                    >
                      <span className="font-medium text-ink">Rerank 3</span>
                      <span className="text-xs text-muted-slate">
                        High-precision search & retrieval layer
                      </span>
                    </a>
                  }
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Solutions Link */}
          <a
            href="#capabilities"
            className="px-3 py-2 text-ink/80 hover:text-ink transition-colors"
          >
            Capabilities
          </a>

          {/* Research Link */}
          <a
            href="#research"
            className="px-3 py-2 text-ink/80 hover:text-ink transition-colors"
          >
            Research
          </a>

          {/* Security Link */}
          <a
            href="#security"
            className="px-3 py-2 text-ink/80 hover:text-ink transition-colors"
          >
            Security & Trust
          </a>

          {/* Pricing / Demo Link */}
          <a
            href="#contact"
            className="px-3 py-2 text-ink/80 hover:text-ink transition-colors"
          >
            Enterprise
          </a>
        </nav>

        {/* Right Zone: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#interactive-console"
            className="text-sm font-medium text-ink/80 hover:text-ink px-3 py-2 transition-colors underline-offset-4 hover:underline"
          >
            Playground
          </a>
          <Button
            size="sm"
            nativeButton={false}
            render={<a href="#contact" />}
            className="rounded-4xl bg-brand-nearblack text-white hover:bg-brand-nearblack/85 px-4 h-9 text-xs font-medium inline-flex items-center gap-1.5 shadow-xs"
          >
            Request a demo
            <ArrowRightIcon className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open menu"
                  className="text-ink"
                >
                  <MenuIcon className="size-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-[300px] p-6 bg-white flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                <SheetHeader className="p-0 text-left">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-brand-nearblack text-white font-mono font-bold text-xs">
                      c:
                    </div>
                    <SheetTitle className="font-display text-lg font-bold text-ink">
                      Cohere Enterprise
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <nav className="flex flex-col gap-4 text-base font-medium text-ink pt-4 border-t border-hairline">
                  <a
                    href="#models"
                    className="hover:text-brand-blue py-1 transition-colors"
                  >
                    Foundation Models
                  </a>
                  <a
                    href="#capabilities"
                    className="hover:text-brand-blue py-1 transition-colors"
                  >
                    Platform Capabilities
                  </a>
                  <a
                    href="#research"
                    className="hover:text-brand-blue py-1 transition-colors"
                  >
                    Research & Benchmarks
                  </a>
                  <a
                    href="#security"
                    className="hover:text-brand-blue py-1 transition-colors"
                  >
                    Data Sovereignty & Security
                  </a>
                  <a
                    href="#faq"
                    className="hover:text-brand-blue py-1 transition-colors"
                  >
                    Technical FAQ
                  </a>
                </nav>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-hairline">
                <Button
                  nativeButton={false}
                  render={<a href="#contact" />}
                  className="w-full rounded-4xl bg-brand-nearblack text-white hover:bg-brand-nearblack/90 h-10 text-sm font-medium justify-center flex items-center gap-2"
                >
                  Request enterprise demo
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href="#interactive-console" />}
                  className="w-full rounded-4xl border-hairline text-ink h-10 text-sm font-medium justify-center flex items-center"
                >
                  Try Playground
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
