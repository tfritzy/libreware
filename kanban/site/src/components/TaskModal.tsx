import { useEffect, useRef, useState } from "react";
import type { Task } from "../db/models";
import { cn } from "../util/cn";
import { Input } from "./ui/input";
import { updateTask } from "../db/mutations";
import { AnonymousAvatar } from "./Avatar/AnonymousAvatar";
import { PriorityIcon } from "./PriorityIcon";
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

  useEffect(() => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description]);

  if (!task) {
    return null;
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 h-screen w-screen bg-zinc-900/25"
        onClick={() => close()}
      />

      <div className="w-3xl px-3 py-2 grow-3 text-zinc-200 bg-zinc-800 border border-zinc-700 shadow-2xl shadow-black/40 rounded-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
            "focus:ring-zinc-200 hover:ring-zinc-600  ocus:ring-[1px] hover:ring-[1px]",
          )}
        />

        <div className="flex flex-row space-x-3">
          <div className="w-2/3">
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
              className={cn(
                "text-zinc-200 bg-zinc-700/40 px-2 text-xl py-2 w-full tracking-tight rounded-lg max-h-96 min-h-48 h-full",
                "resize-none focus:ring-zinc-200 hover:ring-zinc-600 outline-none focus:ring-[1px] hover:ring-[1px]",
              )}
            />
          </div>

          <div className="w-1/3 flex flex-col space-y-3">
            <div
              className={cn(
                "bg-zinc-700/40 py-3 px-3",
                "flex flex-row space-x-2 items-center",
              )}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKzIIT8GhjkdVpSB0gKPt5eopOrI2vggOH9A&s"
                className="h-8 w-8 rounded-full"
              />
              <div>Assignee</div>
            </div>
            <div
              className={cn(
                "bg-zinc-700/40 py-3 px-3",
                "flex flex-row space-x-2 items-center",
              )}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoybLpg8wrrXyEsTq1Z5emjCXi18VnKBsMDQ&s"
                className="h-8 w-8 rounded-full"
              />
              <div>Creator</div>
            </div>
            <div
              className={cn(
                "bg-zinc-700/40 py-3 px-3",
                "flex flex-row space-x-2 items-center",
              )}
            >
              <PriorityIcon
                className="w-8 h-8"
                priority={task.priority || "normal"}
              />
              <div>Priority</div>
            </div>
            <div
              className={cn(
                "bg-zinc-700/40 py-3 px-3",
                "flex flex-row space-x-2 items-center",
              )}
            >
              <Clock className="w-8 h-8 stroke-zinc-600" />
              <div>Last edited</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
