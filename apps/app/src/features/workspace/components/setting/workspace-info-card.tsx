import { Workspace } from "@/lib/types/workspace";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, Info, User } from "lucide-react";

interface WorkspaceInfoCardProps {
  workspace: Workspace;
}

export function WorkspaceInfoCard({ workspace }: WorkspaceInfoCardProps) {
  const formattedCreatedDate = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const formattedUpdatedDate = workspace.updatedAt
    ? new Date(workspace.updatedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="size-5 text-primary" />
            <CardTitle>Metadata & Detail</CardTitle>
          </div>
          <Badge variant={workspace.isActive ? "default" : "secondary"}>
            {workspace.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
        <CardDescription>
          Informasi sistem dan identitas teknis workspace ini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/30">
            <Calendar className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span>Dibuat pada</span>
              <strong className="text-foreground font-medium">
                {formattedCreatedDate}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/30">
            <Calendar className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span>Terakhir diperbarui</span>
              <strong className="text-foreground font-medium">
                {formattedUpdatedDate}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/30">
            <Hash className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span>ID Workspace</span>
              <code className="text-foreground font-mono truncate text-[11px]">
                {workspace.id}
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/30">
            <User className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span>Owner ID</span>
              <code className="text-foreground font-mono truncate text-[11px]">
                {workspace.ownerId}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
