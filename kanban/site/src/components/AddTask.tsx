import { useState } from "react";
import { createTask } from "../db/mutations";

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
      <div className="">
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
    <button className="cursor-pointer" onClick={() => setEditing(true)}>
      + Add task
    </button>
  );
}
