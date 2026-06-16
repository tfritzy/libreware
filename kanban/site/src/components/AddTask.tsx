import { useCallback, useRef, useState } from "react";
import { createTask } from "../db/mutations";
import { Plus } from "lucide-react";
import { PriorityIcon } from "./PriorityIcon";

const placeholders = [
  "Reticulate splines",
  "Poke avocado",
  "Brew potion",
  "Brew coffee",
];

const getRandomPlaceholder = () =>
  placeholders[Math.floor(Math.random() * placeholders.length)];

export function AddTask({
  boardId,
  listId,
  maxWeight,
}: {
  boardId: string;
  listId: string;
  maxWeight: number;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState<string>(
    getRandomPlaceholder(),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const submit = useCallback(() => {
    createTask({
      boardId: boardId,
      description: "",
      priority: "low",
      listId: listId,
      weight: maxWeight + 10,
      name: text,
    }).then(() => buttonRef.current?.focus());
  }, [boardId, listId, maxWeight, text]);

  const reset = useCallback(() => {
    setEditing(false);
    setText("");
    setPlaceholder(getRandomPlaceholder());
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submit();
      reset();
    },
    [submit, reset],
  );

  const handleEscape = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        reset();
      }
    },
    [reset],
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    },
    [],
  );

  return (
    <div className="mt-1">
      {editing && (
        <form onSubmit={handleSubmit} onKeyDown={handleEscape} className="">
          <div className="">
            <div className="focus-within:ring ring-zinc-500 rounded bg-white/5 mb-2 flex flex-row">
              <button className="px-2 ml-1">
                <PriorityIcon priority={"low"} />
              </button>

              <input
                autoFocus
                ref={inputRef}
                id="list_name"
                name="list_name"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                placeholder={placeholder}
                onKeyDown={handleEnter}
                className="placeholder:text-zinc-500 my-2 outline-none focus:border-white/50 w-full resize-none"
              />
            </div>
          </div>
        </form>
      )}

      <button
        key="add-button"
        onClick={() => setEditing(true)}
        ref={buttonRef}
        className={`flex items-center outline-none focus:ring py-2 w-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded cursor-pointer transition-colors ${editing ? "hidden" : ""}`}
      >
        <div className="px-2 ml-1">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <div className="">Add task</div>
      </button>
    </div>
  );
}
