"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status, Priority, Task } from "@prisma/client";
import { ColumnType } from "@/types";

// Get tasks grouped by status for the Kanban board
export async function getGroupedTasks(): Promise<ColumnType[]> {
  try {
    // Fetch all tasks from the database
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Create a map of all statuses with empty task arrays
    const groupedTasks = Object.values(Status).reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Record<Status, Task[]>);

    // Populate the groupedTasks with actual tasks
    tasks.forEach((task) => {
      groupedTasks[task.status].push(task);
    });

    // Convert grouped tasks into ColumnType array
    return Object.entries(groupedTasks).map(([status, tasks]) => ({
      id: status,
      title: status,
      tasks: tasks,
    }));
  } catch (error) {
    console.error("Failed to fetch grouped tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}

// Create a new task
export async function createTask(data: {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  userId: string; // Get this from the authenticated session
}) {
  try {
    // Validate input
    if (!data.title) throw new Error("Title is required");

    // Create task in the database
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        user: { connect: { id: data.userId } },
      },
    });

    // Revalidate the board page to reflect changes
    revalidatePath("/board");
    return task;
  } catch (error) {
    console.error("Failed to create task", error);
    throw error;
  }
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  // Fetch all tasks, ordered by creation date
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Get a single task by ID
export async function getTaskById(id: string): Promise<Task | null> {
  // Find a unique task by its ID
  return await prisma.task.findUnique({
    where: { id },
  });
}

// Update a task
export async function updateTask(id: string, data: Partial<Task>) {
  // Update the task with the given ID
  const task = await prisma.task.update({
    where: { id },
    data,
  });
  // Revalidate the board page to reflect changes
  revalidatePath("/board");
  return task;
}

// Update task status
export async function updateTaskStatus(id: string, status: Status) {
  // Update only the status of the task
  const task = await prisma.task.update({
    where: { id },
    data: { status },
  });
  // Revalidate the board page to reflect changes
  revalidatePath("/board");
  return task;
}

// Delete a task
export async function deleteTask(id: string) {
  // Delete the task with the given ID
  await prisma.task.delete({ where: { id } });
  // Revalidate the board page to reflect changes
  revalidatePath("/board");
}

// Get tasks by status
export async function getTasksByStatus(status: Status): Promise<Task[]> {
  // Fetch tasks with a specific status, ordered by creation date
  return await prisma.task.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });
}

// Update task priority
export async function updateTaskPriority(id: string, priority: Priority) {
  // Update only the priority of the task
  const task = await prisma.task.update({
    where: { id },
    data: { priority },
  });
  // Revalidate the board page to reflect changes
  revalidatePath("/board");
  return task;
}

// Update task due date
export async function updateTaskDueDate(id: string, dueDate: Date | null) {
  // Update only the due date of the task
  const task = await prisma.task.update({
    where: { id },
    data: { dueDate },
  });
  // Revalidate the board page to reflect changes
  revalidatePath("/board");
  return task;
}
