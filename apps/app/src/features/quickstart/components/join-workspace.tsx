"use client";

import { OnBoardingStep } from "./onboarding";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Hash } from "lucide-react";

export function JoinWorkspace() {
  return (
    <OnBoardingStep>
      <div className="flex flex-col items-center justify-center">
        <h1 className="flex items-center text-xl font-semibold">
          <Hash className="h-4 w-4" />
          Join Workspace
        </h1>

        <p className="mb-8 text-sm opacity-50">
          Masukkan kode OTP untuk mengakses
          workspace.
        </p>

        <InputOTP maxLength={8}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>

          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>

          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>

          <InputOTPSeparator />

          <InputOTPGroup>
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </OnBoardingStep>
  );
}