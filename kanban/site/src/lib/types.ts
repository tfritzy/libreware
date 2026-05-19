import { Timestamp } from 'firebase/firestore';

export interface Board {
  id: string;
  ownerId: string;
  name: string;
  createdAt: Timestamp;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  order: number;
}

export interface Task {
  id: string;
  boardId: string;
  listId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Timestamp;
}
