import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../db/models";

export const TaskComponent = ({
  task,
  index,
}: {
  task: Task;
  index: number;
}) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className="flex space-x-2 mb-2 items-center bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer hover:brightness-125 transition-colors duration-[15]"
        >
          <div
            className={`rounded-full h-2 w-2 ${task.color || "bg-zinc-500"}`}
          />
          <div>{task.name}</div>
        </div>
      )}
    </Draggable>
  );
};
