import { useEffect, useRef, useState } from "react";
import type { Task } from "../db/models";
import { cn } from "../util/cn";
import { Input } from "./ui/input";
import { updateTask } from "../db/mutations";
import { PriorityIcon } from "./PriorityIcon";
import { Comments } from "./Comments";
import { Avatar } from "./Avatar/Avatar";
import { Clock } from "lucide-react";

export function TaskModal({
  task,
  close,
}: {
  task: Task | undefined;
  close: () => void;
}) {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setName(task?.name || "");
  }, [task?.name]);

  useEffect(() => {
    setDescription(task?.description || "");
  }, [task?.description]);

  if (!task) {
    return null;
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 h-screen w-screen bg-zinc-900/25"
        onClick={() => close()}
      />

      <div className="w-300 max-w-[90%] px-3 py-2 pb-6 grow-3 text-zinc-200 bg-zinc-800 border border-zinc-700 shadow-2xl shadow-black/40 rounded-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Input
          value={name}
          ref={inputRef}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
          onBlur={() => {
            updateTask(task.id, {
              name: name,
            });
          }}
          className={cn(
            "px-2 text-4xl text-bold py-2 mb-4 w-full tracking-tight rounded-sm",
            "focus:ring-zinc-500 hover:ring-zinc-600 focus:ring-[1px] hover:ring-[1px]",
          )}
        />

        <div className="flex flex-row space-x-3 mb-4">
          <div className="w-1/2">
            <textarea
              value={description}
              ref={descriptionRef}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputRef.current?.blur();
                }
              }}
              onBlur={() => {
                updateTask(task.id, {
                  description: description,
                });
              }}
              placeholder="Add a description..."
              className={cn(
                "text-zinc-200 bg-zinc-700/20 focus:bg-zinc-700/40 px-2 text py-2 w-full tracking-tight rounded-lg max-h-96 min-h-48",
                "resize-none focus:ring-zinc-500 hover:ring-zinc-600 outline-none focus:ring-[1px] hover:ring-[1px]",
              )}
            />
            <div className="grid grid-cols-3 gap-3  p-2 rounded-lg">
              <div className="text-zinc-400 col-span-1 align-self-center justify-self-end">
                Asignee
              </div>
              <div
                className={cn(
                  "bg-zinc-700/20 p-2 rounded-lg",
                  "flex flex-row space-x-2 items-center col-span-2",
                )}
              >
                <Avatar
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKzIIT8GhjkdVpSB0gKPt5eopOrI2vggOH9A&s"
                  className="h-8 w-8"
                />
                <div>Tobi</div>
              </div>

              <div className="text-zinc-400 col-span-1 place-self-center">
                Creator
              </div>
              <div
                className={cn(
                  "bg-zinc-700/20 p-2 rounded-lg",
                  "flex flex-row space-x-2 items-center col-span-2",
                )}
              >
                <Avatar
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoybLpg8wrrXyEsTq1Z5emjCXi18VnKBsMDQ&s"
                  className="h-8 w-8"
                />
                <div>Jim</div>
              </div>

              <div className="text-zinc-400 col-span-1 place-self-center">
                Priority
              </div>
              <div
                className={cn(
                  "bg-zinc-700/20 p-2 rounded-lg",
                  "flex flex-row space-x-2 items-center col-span-2",
                )}
              >
                <PriorityIcon
                  className="w-8 h-8"
                  priority={task.priority || "normal"}
                />
                <div>Low</div>
              </div>

              <div className="text-zinc-400 col-span-1 place-self-center">
                Due
              </div>
              <div
                className={cn(
                  "bg-zinc-700/20 p-2 rounded-lg px-4",
                  "flex flex-row space-x-2 items-center col-span-2",
                )}
              >
                <div>{new Date().toLocaleDateString(undefined)}</div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Comments taskId={task.id} />
          </div>
        </div>
      </div>
    </>
  );
}
