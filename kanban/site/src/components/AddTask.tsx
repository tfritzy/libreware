import { useRef, useState } from "react";
import { createTask } from "../db/mutations";
import { Check, Plus, X } from "lucide-react";

const placeholders = [
  "Reticulate splines",
  "Shave yak",
  "Pet cat",
  "Touch grass",
  "Pat doggo",
  "Sniff cantelope",
  "Register to vote",
  "Poke avocado",
  "Peel bananna",
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
            }).then(() => {
              setName("");
              setEditing(false);
              setPlaceholder(getRandomPlaceholder());
              console.log("Focus");
              buttonRef.current?.focus();
            });
          }}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center space-x-2 px-2.5 py-2 bg-white/5 rounded-lg">
            <button
              onClick={() => setEditing(false)}
              type="button"
              className="hover:text-red-500 text-zinc-500 text-sm font-medium rounded-full cursor-pointer"
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
              className="text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 w-full"
            />

            <button
              type="submit"
              className="hover:bg-white/12 text-emerald-500 font-medium rounded-full cursor-pointer"
            >
              <Check size={14} />
            </button>
          </div>
        </form>
      )}

      <button
        key="add-button"
        onClick={() => setEditing(true)}
        ref={buttonRef}
        className="flex items-center focus:ring gap-1.5 w-full px-2.5 py-2 text-sm text-white hover:bg-white/15 rounded-lg cursor-pointer transition-colors"
      >
        <Plus size={14} />
        <div className="">Add task</div>
      </button>
    </div>
  );
}
