import { useState } from "react";
import { createList } from "../db/mutations";
import { generateId } from "../util/generateId";

export function AddList({ boardId }: { boardId: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  if (editing) {
    return (
      <div className="bg-white/20 rounded">
        <input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <div>
          <button
            onClick={() =>
              createList({
                name: name,
                boardId: boardId,
              })
            }
          >
            Add list
          </button>
          <button onClick={() => setEditing(false)}>X</button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="bg-white/20 px-3 py-2 rounded-lg cursor-pointer"
      onClick={() => setEditing(true)}
    >
      + Add another list
    </button>
  );
}
