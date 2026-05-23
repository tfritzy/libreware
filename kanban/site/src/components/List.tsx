import { useCallback, useEffect, useState } from "react";
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
import { Reorder, type Transition } from "motion/react";

const transition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

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
  const [maxWeight, setMaxWeight] = useState<number>();

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
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      tasksData.sort((t) => t.weight);
      setTasks(tasksData);
      setMaxWeight(tasksData[tasksData.length - 1].weight);
    });

    return unsubscribe;
  }, [user, id]);

  const onReorder = useCallback((tasks: Task[]) => {
    setTasks(tasks);
  }, []);

  return (
    <Box>
      <div className="py-3">
        <h3 className="font-semibold mb-3 pl-4">{list?.name || list?.id}</h3>

        <Reorder.Group
          values={tasks}
          onReorder={onReorder}
          className="space-y-2 px-1"
        >
          {tasks.map((t) => (
            <Reorder.Item key={t.id} value={t} transition={transition}>
              <TaskComponent task={t} key={t.id} />
            </Reorder.Item>
          ))}

          <AddTask boardId={boardId} listId={id} maxWeight={maxWeight} />
        </Reorder.Group>
      </div>
    </Box>
  );
};
