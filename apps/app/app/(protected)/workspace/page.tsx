import { getWorkspaces } from "@/features/workspace/api/get-workspaces";
import { checkIsQuickStart } from "@/lib/quickstart-check";

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces()
  await checkIsQuickStart(workspaces)
  
  return (
    <div>
      
    </div>
  );
}