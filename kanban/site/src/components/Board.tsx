import { useEffect, useState } from "react";
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

export const BoardComponent = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, COLLECTIONS.lists),
      where("boardId", "==", id),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setLists(listsData);
    });

    return unsubscribe;
  }, [user, id]);

  return (
    <div className="flex flex-row space-x-10">
      {lists.map((l) => (
        <ListComponent id={l.id} boardId={id} key={l.id} />
      ))}
      <AddList boardId={id} />
    </div>
  );
};
