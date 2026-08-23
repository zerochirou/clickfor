"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { relativeTime } from "@/lib/relative-time";
import { Workspace } from "@/lib/types/workspace";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveLastWorkspace } from "../../lib/open-last-worspace";
import { Badge } from "@/components/ui/badge";

export function WorkspaceLobbyCard({ workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const handleOpen = async () => {
    await saveLastWorkspace(workspace.id);
    router.push(`/workspace/${workspace.id}`);
  };
  return (
    <Card key={workspace.id} className="bg-white/80 backdrop-blur-md w-full">
      <CardHeader>
        <CardTitle>{workspace.workspaceName}</CardTitle>
        <CardDescription>{workspace.description}</CardDescription>
        <CardAction>
          <Button onClick={handleOpen}>
            Open
            <SquareArrowOutUpRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Badge>{relativeTime(workspace.createdAt)}</Badge>
      </CardFooter>
    </Card>
  );
}
