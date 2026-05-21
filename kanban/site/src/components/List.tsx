import { useEffect, useState } from "react";
import type { List, Task } from "../db/models";
import { useAuth } from "../lib/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import { TaskComponent } from "./Task";
import { AddTask } from "./AddTask";
import { Box } from "./Box";

export const ListComponent = ({
  id,
  boardId,
}: {
  id: string;
  boardId: string;
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [list, setList] = useState<List | undefined>();

  useEffect(() => {
    const listRef = doc(db, COLLECTIONS.lists, id);
    const unsubscribe = onSnapshot(
      listRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as List;
          setList(data);
        } else {
          console.log("No such list", id);
        }
      },
      (error) => {
        console.error("Error listening to list changes:", error);
      },
    );

    return unsubscribe;
  }, [user, id]);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.tasks),
      where("listId", "==", id),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return unsubscribe;
  }, [user, id]);

  return (
    <Box>
      <div className="py-3">
        <h3 className="font-semibold mb-3 pl-4">{list?.name || list?.id}</h3>

        <div className="space-y-2 px-1">
          {tasks.map((t) => (
            <TaskComponent task={t} key={t.id} />
          ))}

          <AddTask boardId={boardId} listId={id} />
        </div>
      </div>
    </Box>
  );
};
