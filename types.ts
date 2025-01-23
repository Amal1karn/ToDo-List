// types.ts
import { Status, Priority } from "@prisma/client";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
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

export interface CardProps {
  task: Task;
  refreshBoard: () => Promise<void>;
}

export interface CardModalProps {
  task: Task;

  onClose: () => void;

  refreshBoard: () => Promise<void>;
}
