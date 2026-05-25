import { useCallback, useEffect, useMemo, useState } from "react";
import type { Board, Task, List } from "../db/models";
import { useAuth } from "../lib/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import { ListComponent } from "./List";
import { AddList } from "./AddList";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

export const BoardComponent = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const [_, setBoard] = useState<Board | undefined>(undefined);
  const [rawLists, setRawLists] = useState<List[]>([]);
  const [rawTasks, setRawTasks] = useState<Task[]>([]);

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
      setRawTasks(tasksData);
    });

    return unsubscribe;
  }, [id]);

  const lists = useMemo(() => {
    const tasksByList = new Map<string, Task[]>();
    rawTasks.forEach((t) => {
      if (!tasksByList.has(t.listId)) tasksByList.set(t.listId, []);
      tasksByList.get(t.listId)?.push(t);
    });

    const updated = rawLists.map((rl) => ({
      ...rl,
      tasks: tasksByList.get(rl.id) || [],
    }));

    return updated;
  }, [rawLists, rawTasks]);

  const onDragEnd = useCallback(async (result: DropResult<string>) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const taskId = draggableId;
    const newlistId = destination.droppableId;

    try {
      const taskRef = doc(db, COLLECTIONS.tasks, taskId);
      await updateDoc(taskRef, { listId: newlistId });
    } catch (error) {
      console.error("Error updating task listId:", error);
    }
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row space-x-4">
        {lists.map((l) => {
          return (
            <ListComponent
              id={l.id}
              boardId={l.boardId}
              name={l.name}
              tasks={l.tasks}
            />
          );
        })}

        <AddList boardId={id} />
      </div>
    </DragDropContext>
  );
};