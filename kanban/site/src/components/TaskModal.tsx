import { useRef } from "react";
import type { Task } from "../db/models";
import { cn } from "../util/cn";
import { Input } from "./ui/input";

export function TaskModal({
  task,
  close,
}: {
  task: Task | null;
  close: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  if (!task) {
    return null;
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 h-screen w-screen bg-zinc-900/25"
        onClick={() => close()}
      />
      <div className="w-3xl px-3 py-2 text-zinc-200 bg-zinc-800 border border-zinc-700 shadow-2xl shadow-black/40 rounded-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Input
          value={task.name}
          ref={inputRef}
          // onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
          // onBlur={() => {
          //   handleNameChange(editedName, board.id);
          //   setBoard({ ...board, name: editedName });
          // }}
          className={cn(
            "px-2 text-4xl text-bold py-2 mb-4 w-full tracking-tight focus:ring-zinc-200 hover:ring-zinc-400  focus:ring-[1px] hover:ring-[1px] rounded-sm",
          )}
        />

        <div>Description</div>
        <textarea
          value={task.name}
          ref={descriptionRef}
          // onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
          // onBlur={() => {
          //   handleNameChange(editedName, board.id);
          //   setBoard({ ...board, name: editedName });
          // }}
          className={cn(
            "text-zinc-200 px-2 text-xl py-2 w-full tracking-tight border border-zinc-600 focus:ring-zinc-200 hover:ring-zinc-400  focus:ring-[1px] hover:ring-[1px] rounded-sm",
          )}
        />
      </div>
    </>
  );
}
