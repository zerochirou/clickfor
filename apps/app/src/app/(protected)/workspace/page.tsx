import { getWorkspaces } from "@/features/workspace/api/get-workspaces";
import { SearchBar } from "@/features/workspace/components/command/search-bar";
import { WorkspaceLobbyLayout } from "@/features/workspace/components/lobby/layout";
import { WorkspaceProvider } from "@/features/workspace/lib/workspaces-provider";
import { checkIsQuickStart } from "@/features/quickstart/lib/quickstart-check";
import { WorkspaceLobbyCard } from "@/features/workspace/components/lobby/card";
import { openLastWorkspace } from "@/features/workspace/lib/open-last-worspace";

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();
  await checkIsQuickStart(workspaces);
  await openLastWorkspace();
  return (
    <WorkspaceProvider initialWorkspaces={workspaces}>
      <WorkspaceLobbyLayout>
        <SearchBar />
        <ul className="grid grid-cols-1 mt-4 gap-4">
          {workspaces.map((workspace) => (
            <WorkspaceLobbyCard workspace={workspace} key={workspace.id} />
          ))}
        </ul>
      </WorkspaceLobbyLayout>
    </WorkspaceProvider>
  );
}
