import { useRef, useState } from "react";
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
}: {
  boardId: string;
  listId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState<string>(
    getRandomPlaceholder(),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTask({
              boardId: boardId,
              description: "",
              listId: listId,
              name: name,
            }).then(() => buttonRef.current?.focus());
            setEditing(false);
            setName("");
            setPlaceholder(getRandomPlaceholder());
          }}
          className="flex flex-col gap-1.5 focus-within:ring ring-zinc-500 rounded-lg bg-white/5"
        >
          <div className="flex items-center space-x-1 py-1 pl-px pr-1">
            <button
              onClick={() => setEditing(false)}
              type="button"
              className="hover:bg-white/12 hover:text-red-500 pl-2 text-zinc-500 text-sm font-medium rounded-lg cursor-pointer"
            >
              <X size={14} />
            </button>

            <input
              autoFocus
              id="list_name"
              type="text"
              name="list_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="placeholder:text-zinc-500 focus:outline-none focus:border-white/50 w-full"
            />

            <button
              type="submit"
              className="hover:bg-white/12 rounded-lg p-1 text-emerald-500 font-medium cursor-pointer"
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
