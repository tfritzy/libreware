import { User } from "lucide-react";
import { cn } from "../../util/cn";

export function AnonymousAvatar({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "bg-linear-to-br from-emerald-500 to-teal-500 rounded-full w-10 h-10 p-1.5",
        className || "",
      )}
    >
      <User className="w-full h-full stroke-white fill-white" strokeWidth={1} />
    </div>
  );
}
