import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { SidebarLayout } from "@/features/workspace/components/sidebar/sidebar-layout";
import { WorkspaceProvider } from "@/features/workspace/lib/workspace-provider";
import { ThemeProvider } from "@/lib/theme-provider";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);
  return (
    <WorkspaceProvider initialWorkspace={workspace}>
      <SidebarLayout>{children}</SidebarLayout>
    </WorkspaceProvider>
  );
}
