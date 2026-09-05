import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function CategoryTooltip({
  name,
  description,
  icon,
}: {
  name: string;
  description: string;
  icon: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Badge variant="secondary" className="h-6">
            {name} {icon}
          </Badge>
        }
      />
      <TooltipContent className={"flex flex-col justify-start items-start px-4 py-2 rounded-sm"}>
        <h1 className="font-semibold">
          {name} {icon}
        </h1>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
