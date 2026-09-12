import { isAuthenticated } from "@/lib/auth/auth-check";
import { getUserProfile } from "@/features/account/api/get-user-profile";
import { AccountHeader } from "@/features/account/components/setting/account-header";
import { AccountSettingView } from "@/features/account/components/setting/account-setting-view";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Akun | Clickfor",
  description:
    "Kelola profil, foto profil, dan keamanan akun Anda di Clickfor.",
};

async function AccountContent() {
  const session = await isAuthenticated();
  const profileData = await getUserProfile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />
      <AccountHeader />
      <main className="flex-1 pb-16">
        <AccountSettingView user={session.user} profileData={profileData} />
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center min-h-[300px]">
          <FlickerSpinner />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
