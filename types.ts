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

export interface BoardProps {
  columns: ColumnType[];
}

export interface ColumnProps {
  column: ColumnType;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onCreateTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  refreshBoard: () => Promise<void>;
}

export interface CardProps {
  task: Task;
  onDelete: () => Promise<void>;
  onUpdate: (task: Task) => Promise<void>;
}

export interface CardModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
  onDelete?: () => Promise<void>;
  mode: "create" | "edit";
}
export interface BoardClientProps {
  initialColumns: ColumnType[];
}
export interface Tab {
  name: string;
  id: string;
}
export { Status, Priority };
