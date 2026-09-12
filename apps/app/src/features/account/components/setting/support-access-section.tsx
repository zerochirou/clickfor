"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface SupportAccessSectionProps {
  userEmail: string;
}

export function SupportAccessSection({ userEmail }: SupportAccessSectionProps) {
  const [supportAccess, setSupportAccess] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dynamic grant expiration display
  const grantDate = new Date();
  grantDate.setDate(grantDate.getDate() + 30);
  const formattedGrantDate = grantDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const handleSupportToggle = (checked: boolean) => {
    setSupportAccess(checked);
    if (checked) {
      toast.success("Akses bantuan teknis diberikan selama 30 hari.");
    } else {
      toast.info("Akses bantuan teknis dinonaktifkan.");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setIsLoggingOut(true);
      const res = await authClient.revokeOtherSessions();

      if (res?.error) {
        throw new Error(
          res.error.message || "Gagal mengeluarkan sesi dari perangkat lain",
        );
      }

      toast.success("Berhasil keluar dari seluruh perangkat lain.");
    } catch (error) {
      console.error("Revoke sessions error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengeluarkan sesi dari perangkat lain",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        Support Access
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      <div className="flex flex-col gap-6">
        {/* 1. Support access Switch Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-foreground">
              Support access
            </h4>
            <p className="text-xs text-muted-foreground">
              {supportAccess
                ? `You have granted us to access to your account for support purposes until ${formattedGrantDate}.`
                : "Grant Clickfor support temporary access to assist with troubleshooting."}
            </p>
          </div>
          <Switch
            checked={supportAccess}
            onCheckedChange={handleSupportToggle}
          />
        </div>

        {/* 2. Log out of all devices Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-foreground">
              Log out of all devices
            </h4>
            <p className="text-xs text-muted-foreground">
              Log out of all other active sessions on other devices besides this
              one.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoggingOut}
            onClick={handleLogoutAllDevices}
            className=""
          >
            {isLoggingOut && <Spinner className="size-3.5" />}
            Log out <LogOut />
          </Button>
        </div>

        {/* 3. Delete my account Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
              Delete my account
            </h4>
            <p className="text-xs text-muted-foreground">
              Permanently delete the account and remove access from all
              workspaces.
            </p>
          </div>
          <DeleteAccountDialog userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
}
