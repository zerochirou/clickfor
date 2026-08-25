import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { SidebarLayout } from "@/features/workspace/components/sidebar/sidebar-layout";
import { WorkspaceProvider } from "@/features/workspace/lib/workspace-provider";
import { isAuthenticated } from "@/lib/auth/auth-check";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { user } = await isAuthenticated();
  const { workspaceId } = await params;
  const workspace = await getWorkspaceById(workspaceId);
  return (
    <WorkspaceProvider initialWorkspace={workspace}>
      <Toaster position="top-right" />
      <SidebarProvider>
        <SidebarLayout user={user}>{children}</SidebarLayout>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
