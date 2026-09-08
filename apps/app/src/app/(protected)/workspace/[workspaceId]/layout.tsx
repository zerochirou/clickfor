import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { SidebarLayout } from "@/features/workspace/components/sidebar/sidebar-layout";
import { WorkspaceProvider } from "@/features/workspace/lib/workspace-provider";
import { isAuthenticated } from "@/lib/auth/auth-check";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/features/workspace/components/sidebar/app-sidebar";
import { Suspense } from "react";

async function WorkspaceSidebar({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { user } = await isAuthenticated();
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    redirect("/workspace");
  }

  return (
    <WorkspaceProvider initialWorkspace={workspace}>
      <AppSidebar user={user} workspace={workspace} />
    </WorkspaceProvider>
  );
}

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<div className="w-[16rem]" />}>
          <WorkspaceSidebar params={params} />
        </Suspense>
        <SidebarLayout>{children}</SidebarLayout>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
