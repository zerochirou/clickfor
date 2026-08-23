import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { redirect } from "next/navigation";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id)
  if (!workspace) {
    redirect('/workspace')
  }
  
  return <div>
  </div>;
}
