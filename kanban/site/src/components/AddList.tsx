import { useCallback, useState } from "react";
import { createList } from "../db/mutations";
import { Check, Plus, X } from "lucide-react";
import { Box } from "./Box";

export function AddList({ boardId }: { boardId: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const stopEditing = useCallback(() => setEditing(false), []);
  const startEditing = useCallback(() => setEditing(true), []);

  const createListFn = useCallback(async () => {
    createList({ name, boardId }).then(() => {
      setName("");
      setEditing(false);
    });
  }, [name, boardId]);

  return (
    <Box>
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createListFn();
          }}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center space-x-2 px-2.5 py-2">
            <button
              onClick={stopEditing}
              type="button"
              className="hover:text-red-500 text-zinc-500 text-sm font-medium rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <input
              autoFocus
              id="list_name"
              type="text"
              name="list_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="List name…"
              className="rounded-lg text-md text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 w-full"
            />

            <button
              type="submit"
              className="hover:bg-white/20 text-emerald-500 font-medium rounded-full cursor-pointer"
            >
              <Check size={20} />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={startEditing}
          className="flex items-center gap-1.5 w-full px-2.5 py-2 text-white hover:bg-white/15 rounded-lg cursor-pointer transition-colors"
        >
          <Plus size={20} />
          <div className="">Add another list</div>
        </button>
      )}
    </Box>
  );
}
