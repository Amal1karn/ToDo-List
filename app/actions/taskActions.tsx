"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Column, ColumnType, Task, Priority, Status } from "@/types";

// Utility function to safely stringify objects for logging
const safeStringify = (obj: any) => JSON.stringify(obj, null, 2);

// Validate task data

// Fetch columns with tasks
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

    console.log("Fetched Columns:", safeStringify(columns));

    return columns.map((column: Column) => ({
      id: column.id,
      title: column.title,
      tasks: column.tasks.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        userId: task.userId ?? null,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch columns with tasks:", error);
    throw new Error("Failed to fetch columns and tasks");
  }
}

// Create a new task
export async function createTask(
  data: Omit<Task, "id" | "createdAt" | "updatedAt">
) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid task data");
  }
  console.log("Creating task with data:", JSON.stringify(data, null, 2));

  try {
    const columnExists = await prisma.column.findUnique({
      where: { id: data.columnId },
    });

    if (!columnExists) {
      throw new Error(`Column with id ${data.columnId} does not exist`);
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: data.userId || null,
        columnId: data.columnId,
      },
    });

    console.log("Task created successfully:", JSON.stringify(task, null, 2));
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create task: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while creating the task");
    }
  }
}

// Update an existing task
export async function updateTask(
  id: string,
  data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
) {
  console.log(`Updating task ${id} with data:`, safeStringify(data));
  try {
    if (data.columnId) {
      const columnExists = await prisma.column.findUnique({
        where: { id: data.columnId },
      });
      if (!columnExists) {
        throw new Error(`Column with id ${data.columnId} does not exist`);
      }
    }
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
    console.log("Updated task:", safeStringify(task));
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to update task with id ${id}:`, error);
    throw new Error(
      `Failed to update task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Move a task to a new column
export async function moveTask(taskId: string, newColumnId: string) {
  console.log(`Moving task ${taskId} to column ${newColumnId}`);
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId },
    });
    console.log("Moved task:", safeStringify(task));
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to move task with id ${taskId}:`, error);
    throw new Error(
      `Failed to move task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete a task
export async function deleteTask(id: string) {
  console.log(`Deleting task ${id}`);
  try {
    await prisma.task.delete({ where: { id } });
    console.log(`Task ${id} deleted successfully`);
    revalidatePath("/board");
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    throw new Error(
      `Failed to delete task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Create a new column
export async function createColumn(title: string, order: number) {
  console.log(`Creating column: ${title}, order: ${order}`);
  try {
    const column = await prisma.column.create({
      data: { title, order },
    });
    console.log("Created column:", safeStringify(column));
    revalidatePath("/board");
    return column;
  } catch (error) {
    console.error("Failed to create column:", error);
    throw new Error(
      `Failed to create column: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Update column order
export async function updateColumnOrder(id: string, newOrder: number) {
  console.log(`Updating order for column ${id} to ${newOrder}`);
  try {
    const column = await prisma.column.update({
      where: { id },
      data: { order: newOrder },
    });
    console.log("Updated column order:", safeStringify(column));
    revalidatePath("/board");
    return column;
  } catch (error) {
    console.error(`Failed to update order for column with id ${id}:`, error);
    throw new Error(
      `Failed to update column order: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete a column
export async function deleteColumn(id: string) {
  console.log(`Deleting column ${id}`);
  try {
    await prisma.column.delete({ where: { id } });
    console.log(`Column ${id} deleted successfully`);
    revalidatePath("/board");
  } catch (error) {
    console.error(`Failed to delete column with id ${id}:`, error);
    throw new Error(
      `Failed to delete column: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
