import { cn } from "../../util/cn";

export function Avatar(props: React.ComponentProps<"img">) {
  return (
    <img
      {...props}
      src={
        props.src ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoybLpg8wrrXyEsTq1Z5emjCXi18VnKBsMDQ&s"
      }
      className={cn("w-10 h-10 rounded-full", props.className)}
    />
  );
}
