import { Priority, Status } from "@prisma/client";

export interface Task {
  id?: string;
  title: string;
  description: string | null;
  priority?: Priority;
  status: Status;
  dueDate?: Date | null;
  userId?: string | null;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}

export interface CardProps {
  task: Task;
  refreshBoard: () => Promise<void>;
  index: number;
}

export interface CardModalProps {
  task: Task;
  onClose: () => void;
  onDelete: () => void;
  refreshBoard: () => Promise<void>;
  mode: "create" | "edit";
  onSubmit: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

export interface BoardClientProps {
  initialColumns: ColumnType[];
}

export interface Tab {
  name: string;
  id: string;
}

export interface ColumnProps {
  column: ColumnType;
  onCreateTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
}

export { Priority, Status };
