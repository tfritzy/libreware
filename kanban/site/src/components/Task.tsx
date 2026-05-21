import type { Task } from "../db/models";

export const TaskComponent = ({ task }: { task: Task }) => {
  return <div className="bg-white/5 rounded-lg px-3 py-2">{task.name}</div>;
};
