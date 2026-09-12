"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/commons/theme-toggle/mode";
import { ArrowLeft, UserCircle } from "lucide-react";

export function AccountHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.history.length > 2) {
              router.back();
            } else {
              router.push("/workspace");
            }
          }}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <UserCircle className="size-5 text-primary" />
          <span className="font-space-grostek font-semibold text-base">
            Pengaturan Akun
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/workspace">
          <Button variant="ghost" size="sm" className="rounded-xl">
            Workspace
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
