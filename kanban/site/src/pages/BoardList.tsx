import { useCallback, useEffect, useState } from "react";
import type { Board } from "../db/models";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { COLLECTIONS } from "../db/collections";
import { db } from "../lib/firebase";
import { createBoard } from "../db/mutations";
import { useAuth } from "../lib/AuthContext";
import { Link } from "react-router-dom";

export function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.boards),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Board[];
      setBoards(boardData);
    });

    return unsubscribe;
  }, []);

  const handleCreateBoard = useCallback(async () => {
    const owner = await user?.getIdToken();

    if (!owner) throw "No user to create board for";

    createBoard({ name: "New board", ownerId: owner });
  }, [user]);

  return (
    <div>
      {boards.map((b) => (
        <Link to={`/board/${b.id}`}>{b.name || "New board"}</Link>
      ))}

      <button onClick={handleCreateBoard}>Create board</button>
    </div>
  );
}
