"use client";

import { useState, useTransition } from "react";
import { Workspace } from "@/lib/types/workspace";
import { WorkspaceProfileSection } from "./workspace-profile-section";
import { WorkspaceAppearanceSection } from "./workspace-appearance-section";
import { WorkspaceDangerSection } from "./workspace-danger-section";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { updateWorkspace } from "../../api/update-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkspaceSettingViewProps {
  workspace: Workspace;
}

export function WorkspaceSettingView({ workspace }: WorkspaceSettingViewProps) {
  const router = useRouter();
  const [isPendingTransition, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // Local states
  const [workspaceName, setWorkspaceName] = useState<string>(
    workspace.workspaceName || "",
  );
  const [description, setDescription] = useState<string>(
    workspace.description || "",
  );
  const [isActive, setIsActive] = useState<boolean>(workspace.isActive ?? true);
  const [logo, setLogo] = useState<string | null>(workspace.image || null);
  const [brandColor, setBrandColor] = useState<string>(
    workspace.brandColor || "#2C68F6",
  );

  const isPending = isSaving || isPendingTransition;

  const isDirty =
    workspaceName !== (workspace.workspaceName || "") ||
    description !== (workspace.description || "") ||
    isActive !== (workspace.isActive ?? true) ||
    logo !== (workspace.image || null) ||
    brandColor !== (workspace.brandColor || "#2C68F6");

  const handleCancel = () => {
    setWorkspaceName(workspace.workspaceName || "");
    setDescription(workspace.description || "");
    setIsActive(workspace.isActive ?? true);
    setLogo(workspace.image || null);
    setBrandColor(workspace.brandColor || "#2C68F6");
    toast.info("Perubahan dibatalkan");
  };

  const handleSave = async () => {
    if (!workspaceName.trim()) {
      toast.error("Nama workspace tidak boleh kosong");
      return;
    }

    const formattedBrandColor =
      brandColor && /^#[0-9A-Fa-f]{3,6}$/.test(brandColor)
        ? brandColor
        : brandColor &&
            !brandColor.startsWith("#") &&
            /^[0-9A-Fa-f]{3,6}$/.test(brandColor)
          ? `#${brandColor}`
          : "#2C68F6";

    try {
      setIsSaving(true);
      await updateWorkspace({
        workspaceId: workspace.id,
        data: {
          workspaceName: workspaceName.trim(),
          description: description.trim() || null,
          isActive: isActive,
          image: logo,
          brandColor: formattedBrandColor,
        },
      });

      // Persist client preferences locally if available
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `clickfor_brand_color_${workspace.id}`,
          formattedBrandColor,
        );
      }

      toast.success("Pengaturan workspace berhasil disimpan!");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to save workspace settings:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan pengaturan workspace",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-10">
      {/* 1. Workspace Profile Section */}
      <WorkspaceProfileSection
        logo={logo}
        workspaceName={workspaceName}
        brandColor={brandColor}
        description={description}
        onLogoChange={(newLogo) => setLogo(newLogo)}
        onWorkspaceNameChange={(val) => setWorkspaceName(val)}
        onBrandColorChange={(val) => setBrandColor(val)}
        onDescriptionChange={(val) => setDescription(val)}
        disabled={isPending}
      />

      {/* 2. Appearance & Preferences Section */}
      <WorkspaceAppearanceSection
        isActive={isActive}
        onIsActiveChange={(val) => setIsActive(val)}
        disabled={isPending}
      />

      {/* 3. Danger Zone Section */}
      <WorkspaceDangerSection
        workspaceId={workspace.id}
        workspaceName={workspace.workspaceName}
      />

      {/* Footer Action Buttons */}
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
