"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ColumnType, Priority, Task, Column } from "@/types";

function validateTaskData(data: any): boolean {
  const requiredFields = ["title", "priority", "columnId"];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  return true;
}
export async function initializeColumns() {
  const columnCount = await prisma.column.count();
  if (columnCount === 0) {
    await prisma.column.createMany({
      data: [
        { title: "To Do", order: 1 },
        { title: "In Progress", order: 2 },
        { title: "Done", order: 3 },
      ],
    });
    console.log("Initial columns created");
    revalidatePath("/board"); // Revalidate the board page to reflect the new columns
  } else {
    console.log("Columns already exist");
  }
}
// Get columns with tasks for the Kanban board
export async function getColumnsWithTasks(): Promise<ColumnType[]> {
  await initializeColumns();
  try {
    const columns = await prisma.column.findMany({
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { order: "asc" },
    });

    console.log("Fetched Columns:", columns);

    return columns.map((column: Column) => ({
      id: column.id,
      title: column.title,
      tasks: column.tasks.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate : null,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch columns with tasks:", error);
    throw new Error("Failed to fetch columns and tasks");
  }
}

// The rest of the file remains unchanged
// Create a new task
export async function createTask(data: {
  title: string;
  description?: string | null; // Optional field
  priority: Priority;
  dueDate?: string | null; // Optional field
  userId?: string | null; // Optional field
  columnId: string;
}) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid task data: payload must be an object");
  }
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: data.userId ? { connect: { id: data.userId } } : undefined,
        column: { connect: { id: data.columnId } },
      },
    });

    console.log("Task created successfully:", JSON.stringify(task, null, 2));
    revalidatePath("/board");
    return task;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to create task: " + error.message);
    } else {
      throw new Error("Failed to create task: " + String(error));
    }
  }
}

// Update a task
export async function updateTask(id: string, data: Partial<Task>) {
  try {
    console.log("Updating task with id:", id);
    console.log("Update data:", JSON.stringify(data, null, 2));

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: data.userId,
        columnId: data.columnId || undefined,
      },
    });

    console.log("Task updated successfully:", JSON.stringify(task, null, 2));
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to update task with id ${id}:`, error);
    throw new Error("An unexpected error occurred while updating the task");
  }
}
// Move a task to a different column
export async function moveTask(taskId: string, newColumnId: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to move task with id ${taskId}:`, error);
    throw new Error("Failed to move task");
  }
}

// Delete a task
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath("/board");
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    throw new Error("An unexpected error occurred while deleting the task");
  }
}

// Create a new column
export async function createColumn(title: string, order: number) {
  try {
    const column = await prisma.column.create({
      data: { title, order },
    });
    revalidatePath("/board");
    return column;
  } catch (error) {
    console.error("Failed to create column:", error);
    throw new Error("An unexpected error occurred while creating the column");
  }
}

// Update column order
export async function updateColumnOrder(id: string, newOrder: number) {
  try {
    const column = await prisma.column.update({
      where: { id },
      data: { order: newOrder },
    });
    revalidatePath("/board");
    return column;
  } catch (error) {
    console.error(`Failed to update order for column with id ${id}:`, error);
    throw new Error("Failed to update column order");
  }
}

// Delete a column
export async function deleteColumn(id: string) {
  try {
    await prisma.column.delete({ where: { id } });
    revalidatePath("/board");
  } catch (error) {
    console.error(`Failed to delete column with id ${id}:`, error);
    throw new Error("An unexpected error occurred while deleting the column");
  }
}
