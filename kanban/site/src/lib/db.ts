import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Board, List, Task } from './types';

// Boards

export function subscribeBoards(ownerId: string, cb: (boards: Board[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'boards'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Board)),
  );
}

export async function createBoard(ownerId: string, name: string): Promise<void> {
  await addDoc(collection(db, 'boards'), {
    ownerId,
    name,
    createdAt: Timestamp.now(),
  });
}

// Lists

export function subscribeLists(boardId: string, cb: (lists: List[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'lists'),
    where('boardId', '==', boardId),
    orderBy('order', 'asc'),
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as List)),
  );
}

export async function createList(boardId: string, name: string, order: number): Promise<void> {
  await addDoc(collection(db, 'lists'), { boardId, name, order });
}

// Tasks

export function subscribeTasks(boardId: string, cb: (tasks: Task[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'tasks'),
    where('boardId', '==', boardId),
    orderBy('order', 'asc'),
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task)),
  );
}

export async function createTask(
  boardId: string,
  listId: string,
  name: string,
  description: string,
  order: number,
): Promise<void> {
  await addDoc(collection(db, 'tasks'), {
    boardId,
    listId,
    name,
    description,
    order,
    createdAt: Timestamp.now(),
  });
}

export async function moveTask(taskId: string, newListId: string): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), { listId: newListId });
}
