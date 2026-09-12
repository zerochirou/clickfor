"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function AccountSessionRow() {
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevokeOtherSessions = async () => {
    try {
      setIsRevoking(true);
      const res = await authClient.revokeOtherSessions();

      if (res?.error) {
        throw new Error(
          res.error.message || "Gagal menghentikan sesi perangkat lain",
        );
      }

      toast.success("Semua sesi di perangkat lain telah berhasil dihentikan.");
    } catch (error) {
      console.error("Revoke sessions error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghentikan sesi perangkat lain",
      );
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full max-w-md">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isRevoking}
        onClick={handleRevokeOtherSessions}
        className="rounded-xl font-medium gap-2 h-9 px-4"
      >
        {isRevoking ? (
          <Spinner className="size-3.5" />
        ) : (
          <LogOut className="size-3.5" />
        )}
        Keluar Perangkat Lain
      </Button>
    </div>
  );
}
