import { useParams } from "react-router-dom";
import type { Board } from "../db/models";
import { useEffect, useState } from "react";
import { COLLECTIONS } from "../db/collections";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function BoardName() {
  const boardId = useParams().boardId;
  const [board, setBoard] = useState<Board | undefined>(undefined);

  useEffect(() => {
    if (!boardId) return;
    const boardRef = doc(db, COLLECTIONS.boards, boardId);
    const unsubscribe = onSnapshot(
      boardRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Board;
          setBoard(data);
        } else {
          console.log("No such board", boardId);
        }
      },
      (error) => {
        console.error("Error listening to board changes:", error);
      },
    );

    return unsubscribe;
  }, [boardId]);

  if (!board) return null;

  return (
    <button className="cursor-pointer hover:bg-white/10 rounded px-3 py-1">
      <h1 className="text-zinc-900/90 text-lg font-semibold tracking-tight">
        {board.name}
      </h1>
    </button>
  );
}
