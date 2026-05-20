import { useState } from "react";
import { createList, createTask } from "../db/mutations";
import { generateId } from "../util/generateId";
import { Timestamp } from "firebase/firestore";

export function AddTask({
  boardId,
  listId,
}: {
  boardId: string;
  listId: string;
}) {
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
            onClick={() => {
              createTask({
                name: name,
                boardId: boardId,
                listId: listId,
                description: "",
              }).then(() => setEditing(false));
            }}
          >
            Add task
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
      + Add task
    </button>
  );
}
