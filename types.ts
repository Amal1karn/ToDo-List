// types.ts
import { Status, Priority } from "@prisma/client";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  userId: string; // Changed from userID to userId to match Prisma schema
  createdAt: Date; // Changed from string to Date
  updatedAt: Date; // Changed from string to Date
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}

// Alias for ColumnType to maintain consistency
export type Column = ColumnType;

export interface ColumnProps {
  column: Column;
}

export interface Tab {
  name: string;
  id: string;
}

export interface BoardClientProps {
  initialColumns: ColumnType[];
}
export { Status, Priority };
