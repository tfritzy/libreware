import { useCallback, useState } from "react";
import { createList } from "../db/mutations";

export function AddList({ boardId }: { boardId: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const stopEditing = useCallback(() => setEditing(false), []);
  const startEditing = useCallback(() => setEditing(true), []);

  const createListFn = useCallback(() => {
    createList({ name, boardId });
    setName("");
    setEditing(false);
  }, [name, boardId]);

  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/10 text-white rounded-xl p-1 w-60">
      {editing ? (
        <div className="flex flex-col gap-1.5 p-1">
          <input
            autoFocus
            id="list_name"
            type="text"
            name="list_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List name…"
            className="bg-black/15 border border-white/30 rounded-md px-2.5 py-1.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 w-full"
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={createListFn}
              className="bg-white/90 hover:bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer"
            >
              Add list
            </button>
            <button
              onClick={stopEditing}
              className="text-white/70 hover:text-white hover:bg-white/15 text-lg leading-none px-2 py-1.5 rounded-md cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startEditing}
          className="flex items-center gap-1.5 w-full px-2.5 py-2 text-sm text-white hover:bg-white/15 rounded-lg cursor-pointer"
        >
          <span className="text-lg font-light leading-none">+</span>
          Add another list
        </button>
      )}
    </div>
  );
}
