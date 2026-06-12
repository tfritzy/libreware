import { cn } from "../../util/cn";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      autoFocus
      type={type}
      {...props}
      className={cn(
        "rounded-lg text-md focus:outline-none px-2",
        className || "",
      )}
    />
  );
}
