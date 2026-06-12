import type { Task } from "../db/models";
import { TaskComponent } from "./Task";
import { AddTask } from "./AddTask";
import { Box } from "./Box";
import { Droppable } from "@hello-pangea/dnd";

export const ListComponent = ({
  id,
  boardId,
  name,
  tasks,
  setInspectedTask,
}: {
  id: string;
  boardId: string;
  name: string;
  tasks: Task[];
  setInspectedTask: (task: Task) => void;
}) => {
  const maxWeight = tasks.reduce((max, task) => Math.max(max, task.weight), 0);

  return (
    <Box>
      <div className="py-3">
        <h3 className="font-semibold mb-3 pl-4">{name || id}</h3>

        <div className="">
          <Droppable droppableId={id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((t, i) => (
                  <TaskComponent
                    task={t}
                    key={t.id}
                    index={i}
                    onClick={() => setInspectedTask(t)}
                  />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <AddTask boardId={boardId} listId={id} maxWeight={maxWeight} />
        </div>
      </div>
    </Box>
  );
};
