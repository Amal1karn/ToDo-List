"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status, Priority, Task, Prisma } from "@prisma/client";
import { ColumnType } from "@/types";

function validateTaskData(data: any): boolean {
  const requiredFields = ["title", "status", "priority"];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  return true;
}

// Get tasks grouped by status for the Kanban board
export async function getGroupedTasks(): Promise<ColumnType[]> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    const groupedTasks = Object.values(Status).reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Record<Status, Task[]>);

    tasks.forEach((task) => {
      groupedTasks[task.status].push(task);
    });

    return Object.entries(groupedTasks).map(([status, tasks]) => ({
      id: status,
      title: status,
      tasks: tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch grouped tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}
// Create a new task
export async function createTask(data: {
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  dueDate?: string | null;
}) {
  console.log("Input data for createTask:", data); // Debugging checking what data is being passed

  if (!validateTaskData(data)) {
    throw new Error("Invalid task data");
  }
  try {
    if (!data.title) throw new Error("Title is required");

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error("Failed to create task", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error message:", error.message);
    }
    throw new Error("An unexpected error occurred while creating the task");
  }
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  try {
    return await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch all tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}

// Get a single task by ID
export async function getTaskById(id: string): Promise<Task | null> {
  try {
    return await prisma.task.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to fetch task with id ${id}:`, error);
    throw new Error("Failed to fetch task");
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while updating the task");
  }
}

// Update task status
export async function updateTaskStatus(id: string, status: Status) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to update status for task with id ${id}:`, error);
    throw new Error("Failed to update task status");
  }
}

// Delete a task
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath("/board");
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while deleting the task");
  }
}

// Get tasks by status
export async function getTasksByStatus(status: Status): Promise<Task[]> {
  try {
    return await prisma.task.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(`Failed to fetch tasks with status ${status}:`, error);
    throw new Error("Failed to fetch tasks by status");
  }
}

// Update task priority
export async function updateTaskPriority(id: string, priority: Priority) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { priority },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to update priority for task with id ${id}:`, error);
    throw new Error("Failed to update task priority");
  }
}

// Update task due date
export async function updateTaskDueDate(id: string, dueDate: Date | null) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { dueDate },
    });
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error(`Failed to update due date for task with id ${id}:`, error);
    throw new Error("Failed to update task due date");
  }
}
