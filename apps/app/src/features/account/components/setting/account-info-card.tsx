import { UserProfileResponse } from "../../api/get-user-profile";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Hash,
  Building2,
  Layers,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface AccountInfoCardProps {
  user: {
    id: string;
    email: string;
    emailVerified?: boolean;
    createdAt?: Date | string;
  };
  profileData?: UserProfileResponse | null;
}

export function AccountInfoCard({ user, profileData }: AccountInfoCardProps) {
  const createdDate = user.createdAt || profileData?.createdAt;
  const formattedCreatedDate = createdDate
    ? new Date(createdDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-xs text-muted-foreground">
      {/* 1. Tanggal Bergabung */}
      <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
        <Calendar className="size-4 text-primary shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span>Bergabung sejak</span>
          <strong className="text-foreground font-medium">
            {formattedCreatedDate}
          </strong>
        </div>
      </div>

      {/* 2. Status Akun */}
      <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
        {user.emailVerified ? (
          <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
        ) : (
          <AlertCircle className="size-4 text-amber-500 shrink-0" />
        )}
        <div className="flex flex-col gap-0.5">
          <span>Status Verifikasi Email</span>
          <div>
            {user.emailVerified ? (
              <Badge
                variant="default"
                className="text-[10px] h-4.5 px-2 bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30"
              >
                Terverifikasi
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] h-4.5 px-2">
                Belum Terverifikasi
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 3. User ID */}
      <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30 sm:col-span-2">
        <Hash className="size-4 text-primary shrink-0" />
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span>ID Akun</span>
          <code className="text-foreground font-mono truncate text-[11px]">
            {user.id}
          </code>
        </div>
      </div>

      {/* 4. Workspace Stats (if available) */}
      {profileData?.stats && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
            <Building2 className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span>Workspace Dimiliki</span>
              <strong className="text-foreground font-medium">
                {profileData.stats.ownedWorkspaces} Workspace
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
            <Layers className="size-4 text-primary shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span>Kolaborasi Workspace</span>
              <strong className="text-foreground font-medium">
                {profileData.stats.memberWorkspaces} Workspace
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
