import { User } from "lucide-react";

export function AnonymousAvatar() {
  return (
    <div className="bg-linear-to-br from-emerald-500 to-teal-800 rounded-full w-10 h-10 p-1.5">
      <User className="w-full h-full stroke-white fill-white" strokeWidth={1} />
    </div>
  );
}
