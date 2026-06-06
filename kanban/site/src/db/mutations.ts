import {
  setDoc,
  doc,
  Timestamp,
  updateDoc,
  Transaction,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Board, List, Task } from "./models";
import { COLLECTIONS } from "./collections";
import { generateId } from "../util/generateId";
import { getRandomColor } from "../util/color";

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "color">,
) {
  const id = generateId("task");
  await setDoc(doc(db, COLLECTIONS.tasks, id), {
    ...task,
    color: getRandomColor(),
    id: id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateTask(taskId: string, task: Partial<Task>) {
  const taskRef = doc(db, COLLECTIONS.tasks, taskId);

  await updateDoc(taskRef, {
    ...task,
    updatedAt: Timestamp.now(),
  });
}

export function updateTaskWithTransaction(
  transaction: Transaction,
  taskId: string,
  task: Partial<Task>,
) {
  const taskRef = doc(db, COLLECTIONS.tasks, taskId);

  transaction.update(taskRef, {
    ...task,
    updatedAt: Timestamp.now(),
  });
}

export async function createBoard(
  board: Omit<Board, "id" | "createdAt" | "updatedAt" | "viewedAt">,
): Promise<string> {
  const id = generateId("board");
  await setDoc(doc(db, COLLECTIONS.boards, id), {
    ...board,
    id: id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    viewedAt: Timestamp.now(),
  });

  return id;
}

export async function updateBoard(boardId: string, board: Board) {
  const boardRef = doc(db, COLLECTIONS.boards, boardId);

  await updateDoc(boardRef, {
    ...board,
    updatedAt: Timestamp.now,
  });
}

export async function createList(
  list: Omit<List, "id" | "createdAt" | "updatedAt">,
) {
  const id = generateId("list");
  await setDoc(doc(db, COLLECTIONS.lists, id), {
    ...list,
    id: id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updatelist(listId: string, list: List) {
  const listRef = doc(db, COLLECTIONS.lists, listId);

  await updateDoc(listRef, {
    ...list,
    updatedAt: Timestamp.now,
  });
}
