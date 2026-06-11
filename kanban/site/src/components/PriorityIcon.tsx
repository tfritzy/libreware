import {
  ChevronDown,
  ChevronUp,
  Flame,
  Minus,
  type LucideProps,
} from "lucide-react";
import type { Priority } from "../db/models";
import { cn } from "../util/cn";

export function PriorityIcon({
  priority,
  ...props
}: { priority: Priority } & LucideProps) {
  switch (priority) {
    case "highest":
      return (
        <Flame
          {...props}
          className={cn("h-3.5 w-3.5 stroke-zinc-500", props.className || "")}
        />
      );
    case "high":
      return (
        <ChevronUp
          {...props}
          className={cn("h-3.5 w-3.5 stroke-zinc-500", props.className || "")}
        />
      );
    case "normal":
      return (
        <Minus
          {...props}
          className={cn("h-3.5 w-3.5 stroke-zinc-500", props.className || "")}
        />
      );
    case "low":
      return (
        <ChevronDown
          {...props}
          className={cn("h-3.5 w-3.5 stroke-zinc-500", props.className || "")}
        />
      );
  }
}
