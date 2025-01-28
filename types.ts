// types.ts

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  userId: string | null;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}

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
export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";
export interface CardProps {
  task: Task;
  refreshBoard: () => Promise<void>;
}

export interface CardModalProps {
  task: Task;

  onClose: () => void;

  refreshBoard: () => Promise<void>;
}
