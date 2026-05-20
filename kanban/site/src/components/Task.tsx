import type { Task } from "../db/models";

export const TaskComponent = ({ task }: { task: Task }) => {
  return <div className="bg-neutral-700 rounded px-4 py-2">{task.name}</div>;
};
