import { useCallback, useEffect, useRef, useState } from "react";
import { createTask } from "../db/mutations";
import { Check, Plus, X } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState<string>(
    getRandomPlaceholder(),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createTask({
        boardId: boardId,
        description: "",
        listId: listId,
        weight: maxWeight + 10,
        name: text,
      }).then(() => buttonRef.current?.focus());
      setEditing(false);
      setText("");
      setPlaceholder(getRandomPlaceholder());
    },
    [boardId, listId, text, maxWeight],
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        <form
          onSubmit={handleSubmit}
          className="focus-within:ring ring-zinc-500 rounded-lg bg-white/5"
        >
          <div className="flex flex-row items-stretch space-x-1">
            <button
              onClick={() => setEditing(false)}
              type="button"
              className="hover:bg-white/12 pl-2 hover:text-red-500 focus:text-red-500 ring-red-500 focus:ring outline-none p-1 text-zinc-500 text-sm font-medium rounded-l-lg cursor-pointer"
            >
              <X size={14} />
            </button>

            <textarea
              autoFocus
              ref={textareaRef}
              id="list_name"
              name="list_name"
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleEnter}
              className="placeholder:text-zinc-500 my-2 outline-none pt-px focus:border-white/50 w-full resize-none"
            />

            <button
              type="submit"
              className="hover:bg-white/12 rounded-r-l p-1 focus:ring outline-none text-emerald-500 ring-emerald-500 font-medium cursor-pointer rounded-r-lg"
            >
              <Check size={20} />
            </button>
          </div>
        </form>
      )}

      <button
        key="add-button"
        onClick={() => setEditing(true)}
        ref={buttonRef}
        className={`flex items-center outline-none focus:ring space-x-1 w-full p-2 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg cursor-pointer transition-colors ${editing ? "hidden" : ""}`}
      >
        <Plus size={16} />
        <div className="">Add task</div>
      </button>
    </div>
  );
}
