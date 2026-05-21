import { useState } from "react";
import { createTask } from "../db/mutations";
import { Plus } from "lucide-react";

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
    <button
      className="cursor-pointer hover:bg-white/5 rounded-lg px-3 py-1 w-full text-start flex items-center space-x-1"
      onClick={() => setEditing(true)}
    >
      <Plus size={16} /> <span>Add task</span>
    </button>
  );
}
