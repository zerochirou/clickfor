import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { WorkspaceSettingView } from "@/features/workspace/components/setting/workspace-setting-view";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FlickerSpinner from "@/components/commons/flicker-loading/flicker-spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Workspace | Clickfor",
  description:
    "Kelola pengaturan dan informasi umum workspace Anda di Clickfor.",
};

async function SettingContent({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    redirect("/workspace");
  }

  return <WorkspaceSettingView workspace={workspace} />;
}

export default function SettingPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center min-h-[300px]">
          <FlickerSpinner />
        </div>
      }
    >
      <SettingContent params={params} />
    </Suspense>
  );
}
