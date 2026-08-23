import { SidebarProvider } from "@/components/ui/sidebar";
import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { SidebarLayout } from "@/features/workspace/components/sidebar/sidebar-layout";
import { WorkspaceProvider } from "@/features/workspace/lib/workspace-provider";
import { isAuthenticated } from "@/lib/auth/auth-check";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { user } = await isAuthenticated();
  const { id } = await params;
  const workspace = await getWorkspaceById(id);
  return (
    <WorkspaceProvider initialWorkspace={workspace}>
      <SidebarProvider>
        <SidebarLayout user={user}>{children}</SidebarLayout>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
