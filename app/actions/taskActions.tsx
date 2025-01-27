"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Priority, Task, Prisma } from "@prisma/client";
import { ColumnType } from "@/types";

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

// Get columns with tasks for the Kanban board
export async function getColumnsWithTasks(): Promise<ColumnType[]> {
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

    return columns.map((column) => ({
      id: column.id,
      title: column.title,
      tasks: column.tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch columns with tasks:", error);
    throw new Error("Failed to fetch columns and tasks");
  }
}

// Create a new task
export async function createTask(data: {
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | null;
  columnId: string;
}) {
  if (!validateTaskData(data)) {
    throw new Error("Invalid task data");
  }
  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error("Failed to create task", error);
    throw new Error("An unexpected error occurred while creating the task");
  }
}

// Update a task
export async function updateTask(id: string, data: Partial<Task>) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data,
    });
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
