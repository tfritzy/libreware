import type { Task } from "../db/models";

export const TaskComponent = ({ task }: { task: Task }) => {
  return (
    <div className="flex space-x-2 items-center bg-white/5 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/8 transition-colors duration-[15]">
      <div className={`rounded-full h-2 w-2 ${task.color || "bg-zinc-500"}`} />
      <div>{task.name}</div>
    </div>
  );
};
