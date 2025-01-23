"use client";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { ColumnType, Status, Priority, Task } from "../types";
import { createTask } from "../app/actions/taskActions";

export function Column({
  column,
  refreshBoard,
}: {
  column: ColumnType;
  refreshBoard: () => Promise<void>;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = async (
    newTask: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createTask({
        ...newTask,
        status: column.id as Status,
      });
      setIsModalOpen(false);
      await refreshBoard();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg shadow-md w-64">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <SortableContext
        items={column.tasks}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <Card key={task.id} task={task} refreshBoard={refreshBoard} />
        ))}
      </SortableContext>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        New Task
      </button>
      {isModalOpen && (
        <CardModal
          task={
            {
              title: "",
              description: "",
              status: column.id as Status,
              priority: Priority.MEDIUM,
              dueDate: null,
              userId: null,
            } as Task
          }
          onClose={() => setIsModalOpen(false)}
          refreshBoard={refreshBoard}
          mode="create"
        />
      )}
    </div>
  );
}
