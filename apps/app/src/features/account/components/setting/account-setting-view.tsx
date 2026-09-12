"use client";

import { useState, useTransition } from "react";
import { User } from "better-auth";
import { UserProfileResponse } from "../../api/get-user-profile";
import { ProfileSection } from "./profile-section";
import { SecuritySection } from "./security-section";
import { SupportAccessSection } from "./support-access-section";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AccountSettingViewProps {
  user: User;
  profileData?: UserProfileResponse | null;
}

export function AccountSettingView({ user }: AccountSettingViewProps) {
  const router = useRouter();
  const [isPendingTransition, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // Split name into first and last name
  const initialParts = (user.name || "").trim().split(" ");
  const initialFirstName = initialParts[0] || "";
  const initialLastName = initialParts.slice(1).join(" ") || "";

  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);
  const [avatar, setAvatar] = useState<string | null>(user.image || null);

  const isPending = isSaving || isPendingTransition;

  const isDirty =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    avatar !== (user.image || null);

  const handleCancel = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setAvatar(user.image || null);
    toast.info("Perubahan dibatalkan");
  };

  const handleSave = async () => {
    const fullName = [firstName.trim(), lastName.trim()]
      .filter(Boolean)
      .join(" ");

    if (!fullName) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    try {
      setIsSaving(true);
      const res = await authClient.updateUser({
        name: fullName,
        image: avatar || "",
      });

      if (res?.error) {
        throw new Error(res.error.message || "Gagal menyimpan perubahan");
      }

      toast.success("Profil akun berhasil diperbarui!");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to save account settings:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan pengaturan akun",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-10">
      {/* 1. My Profile Section */}
      <ProfileSection
        avatar={avatar}
        firstName={firstName}
        lastName={lastName}
        onAvatarChange={(newUrl) => setAvatar(newUrl)}
        onFirstNameChange={(val) => setFirstName(val)}
        onLastNameChange={(val) => setLastName(val)}
        disabled={isPending}
      />

      {/* 2. Account Security Section */}
      <SecuritySection email={user.email} />

      {/* 3. Support Access Section */}
      <SupportAccessSection userEmail={user.email} />

      {/* Footer Action Buttons (Active when name modified) */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/70">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={!isDirty || isPending}
          className="rounded-lg px-5 h-9"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="rounded-lg px-5 h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending && <Spinner className="size-4" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
