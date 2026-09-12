"use client";

import { WorkspaceDeleteDialog } from "./workspace-delete-dialog";

interface WorkspaceDangerSectionProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceDangerSection({
  workspaceId,
  workspaceName,
}: WorkspaceDangerSectionProps) {
  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <h2 className="text-xl font-bold text-foreground font-space-grostek">
        Danger Zone
      </h2>
      <div className="border-b border-border/70 mt-3 mb-6" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
            Hapus workspace ini
          </h4>
          <p className="text-xs text-muted-foreground">
            Hapus permanen ruang kerja &quot;{workspaceName}&quot; beserta semua
            produk, kategori, dan data terkait.
          </p>
        </div>

        <WorkspaceDeleteDialog
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
      </div>
    </div>
  );
}
