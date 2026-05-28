import { useCallback, useEffect, useMemo, useState } from "react";
import type { Board, Task, List } from "../db/models";
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
import { ListComponent } from "./List";
import { AddList } from "./AddList";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { updateTask } from "../db/mutations";

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

  const onDragEnd = useCallback(
    (result: DropResult<string>) => {
      const { source, destination, draggableId } = result;
      
      if (!destination) {
        return;
      }

      // If moving within the same list, do nothing for now (or implement reordering)
      if (source.droppableId === destination.droppableId) {
        // TODO: Implement reordering within the same list
        return;
      }

      const destListId = destination.droppableId;

      // Find the task being dragged
      const draggedTask = rawTasks.find((t) => t.id === draggableId);
      if (!draggedTask) return;

      // Get tasks currently in the destination list, excluding the dragged task
      const destListTasks = rawTasks
        .filter((t) => t.listId === destListId && t.id !== draggableId)
        .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)); // Sort by weight

      let newWeight: number;

      if (destination.index === 0) {
        // Dropped at the beginning
        if (destListTasks.length === 0) {
          newWeight = 1000; // Arbitrary starting weight for an empty list
        } else {
          newWeight = (destListTasks[0].weight ?? 0) / 2;
        }
      } else if (destination.index >= destListTasks.length) {
        // Dropped at the end
        if (destListTasks.length === 0) {
          newWeight = 1000; // Should not happen if index >= length and length is 0, but for safety
        } else {
          newWeight = (destListTasks[destListTasks.length - 1].weight ?? 0) + 1000;
        }
      } else {
        // Dropped in the middle
        const prevTaskWeight = destListTasks[destination.index - 1].weight ?? 0;
        const nextTaskWeight = destListTasks[destination.index].weight ?? 0;
        newWeight = (prevTaskWeight + nextTaskWeight) / 2;
      }

      // Optimistic UI update
      const updatedRawTasks = rawTasks.map((task) =>
        task.id === draggableId
          ? { ...task, listId: destListId, weight: newWeight }
          : task,
      );
      setRawTasks(updatedRawTasks);

      // Update in DB
      updateTask(draggableId, { listId: destListId, weight: newWeight });
    },
    [rawTasks],
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
            />
          );
        })}

        <AddList boardId={id} />
      </div>
    </DragDropContext>
  );
};