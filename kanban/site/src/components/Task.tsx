import {
  Draggable,
  type DraggableStateSnapshot,
  type DraggableStyle,
} from "@hello-pangea/dnd";
import type { Task } from "../db/models";
import { PriorityIcon } from "./PriorityIcon";

function getStyle(
  style: DraggableStyle | undefined,
  snapshot: DraggableStateSnapshot,
) {
  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    transitionDuration: `0.1s`,
  };
}

export const TaskComponent = ({
  task,
  onClick,
  index,
}: {
  task: Task;
  onClick: () => void;
  index: number;
}) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="py-1"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getStyle(provided.draggableProps.style, snapshot)}
          onClick={onClick}
        >
          <div className="flex space-x-2 items-center bg-zinc-800 cursor-pointer rounded px-3 py-2 hover:brightness-125 transition-colors duration-[15]">
            <PriorityIcon priority={task.priority || "normal"} />
            <div>{task.name}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
