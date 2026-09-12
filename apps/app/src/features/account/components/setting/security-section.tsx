"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChangeEmailDialog } from "./change-email-dialog";
import { PasswordChangeDialog } from "./password-change-dialog";
import { toast } from "sonner";

interface SecuritySectionProps {
  email: string;
}

export function SecuritySection({ email }: SecuritySectionProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    if (checked) {
      toast.info("2-Step Verification diaktifkan untuk akun ini.");
    } else {
      toast.info("2-Step Verification dinonaktifkan.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        Account Security
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      <div className="flex flex-col gap-6">
        {/* Email Row */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="emailInput"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Input
              id="emailInput"
              value={email}
              disabled
              className="max-w-md  h-10 bg-muted/40 text-muted-foreground border-border/80 cursor-not-allowed"
            />
            <ChangeEmailDialog currentEmail={email} />
          </div>
        </div>

        {/* Password Row */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="passwordInput"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Input
              id="passwordInput"
              type="password"
              value="••••••••••••"
              disabled
              className="max-w-md  h-10 bg-muted/40 text-muted-foreground border-border/80 cursor-not-allowed"
            />
            <PasswordChangeDialog />
          </div>
        </div>

        {/* 2-Step Verifications Row */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-foreground">
              2-Step Verifications
            </h4>
            <p className="text-xs text-muted-foreground">
              Add an additional layer of security to your account during login.
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorToggle}
          />
        </div>
      </div>
    </div>
  );
}
