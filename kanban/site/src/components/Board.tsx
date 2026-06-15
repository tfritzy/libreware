import { useCallback, useEffect, useMemo, useState } from "react";
import type { Board, Task, List } from "../db/models";
import { useAuth } from "../lib/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import { ListComponent } from "./List";
import { AddList } from "./AddList";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { updateTask, updateTaskWithTransaction } from "../db/mutations";
import { TaskModal } from "./TaskModal";

export const BoardComponent = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const [_, setBoard] = useState<Board | undefined>(undefined);
  const [rawLists, setRawLists] = useState<List[]>([]);
  const [rawTasks, setRawTasks] = useState<Task[]>([]);
  const [inspectedTask, setInspectedTask] = useState<string | null>(null);

  useEffect(() => {
    const boardRef = doc(db, COLLECTIONS.boards, id);
    const unsubscribe = onSnapshot(
      boardRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Board;
          setBoard(data);
        } else {
          console.log("No such board", id);
        }
      },
      (error) => {
        console.error("Error listening to board changes:", error);
      },
    );

    return unsubscribe;
  }, [user, id]);

  useEffect(() => {
    const recordView = async () => {
      try {
        const boardRef = doc(db, COLLECTIONS.boards, id);
        await updateDoc(boardRef, {
          viewedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to update board viewedAt timestamp:", error);
      }
    };

    recordView();
  }, [id]);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.lists),
      where("boardId", "==", id),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as List[];
      setRawLists(listData);
    });

    return unsubscribe;
  }, [id]);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.tasks),
      where("boardId", "==", id),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      tasksData.sort((a, b) => a.weight - b.weight);
      setRawTasks(tasksData);
    });

    return unsubscribe;
  }, [id]);

  const needsRebalance = useCallback((tasks: Task[]) => {
    for (let i = 1; i < tasks.length; i++) {
      if (Math.abs(tasks[i].weight) - Math.abs(tasks[i - 1].weight) < 1) {
        return true;
      }
    }

    return false;
  }, []);

  const onDragEnd = useCallback(
    async (result: DropResult<string>) => {
      const { source, destination, draggableId } = result;

      const sourceList = source.droppableId;
      const destList = destination?.droppableId;

      if (!sourceList || !destList) return;

      const updated = [...rawTasks];
      const task = updated.find((t) => t.id === draggableId)!;

      let listTasks = rawTasks
        .filter(
          (t) => t.listId === destination?.droppableId && t.id !== task?.id,
        )
        .sort((a, b) => a.weight - b.weight);

      let weight;
      const destI = destination.index;

      if (listTasks.length === 0) {
        weight = 0;
      } else if (destI === 0) {
        weight = listTasks[0].weight - 1_000_000;
      } else if (destI >= listTasks.length) {
        weight = listTasks[listTasks.length - 1].weight + 1_000_000;
      } else {
        const lowerWeight = listTasks[destI - 1].weight;
        const upperWeight = listTasks[destI].weight;
        weight = lowerWeight + (upperWeight - lowerWeight) / 2;
      }

      task.listId = destList;
      task.weight = weight;

      updated.sort((a, b) => a.weight - b.weight);

      listTasks = updated.filter((t) => t.listId === destList);
      if (needsRebalance(listTasks)) {
        for (let i = 0; i < listTasks.length; i++) {
          listTasks[i].weight = i * 1_000_000;
        }

        setRawTasks(updated);

        await runTransaction(db, async (transaction) => {
          for (let i = 0; i < listTasks.length; i++) {
            updateTaskWithTransaction(transaction, listTasks[i].id, {
              listId: listTasks[i].listId,
              weight: listTasks[i].weight,
            });
          }
        });
      } else {
        await updateTask(task.id, {
          listId: task.listId,
          weight: task.weight,
        });
        setRawTasks(updated);
      }
    },
    [needsRebalance, rawTasks],
  );

  const lists = useMemo(() => {
    const tasksByList = new Map<string, Task[]>();
    rawTasks.forEach((t) => {
      const listTasks = tasksByList.get(t.listId) ?? [];
      listTasks.push(t);
      tasksByList.set(t.listId, listTasks);
    });

    const updated = rawLists.map((rl) => ({
      ...rl,
      tasks: tasksByList.get(rl.id) || [],
    }));

    return updated;
  }, [rawLists, rawTasks]);

  const setTaskInspected = useCallback((task: Task) => {
    setInspectedTask(task.id);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row space-x-4">
        {lists.map((l) => {
          return (
            <ListComponent
              key={l.id}
              id={l.id}
              boardId={l.boardId}
              name={l.name}
              tasks={l.tasks}
              setInspectedTask={setTaskInspected}
            />
          );
        })}

        <AddList boardId={id} />
      </div>

      <TaskModal
        task={rawTasks.find((t) => t.id === inspectedTask)}
        close={() => setInspectedTask(null)}
        key="inspect-modal"
      />
    </DragDropContext>
  );
};
