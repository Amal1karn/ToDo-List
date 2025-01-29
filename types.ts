export interface Task {
  id?: string;
  title: string;
  description: string | null;
  priority: Priority;
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
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
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
