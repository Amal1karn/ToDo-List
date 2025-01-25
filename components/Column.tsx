"use client";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
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
    <div ref={setNodeRef} className="bg-gray-200 p-4 rounded-lg shadow-md w-64">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <SortableContext items={column.tasks} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-2">
          {column.tasks.map((task, index) => (
            <div key={task.id} style={{ marginTop: index > 0 ? "-2rem" : "0" }}>
              <Card task={task} refreshBoard={refreshBoard} />
            </div>
          ))}
        </div>
      </SortableContext>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full border-2 border-white border-dashed text-white px-4 py-2 rounded hover:bg-neutral-300 text-3xl font-extrabold"
      >
        +
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
