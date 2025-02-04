"use client";
import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { ColumnType, Task, Priority } from "../types";
import { createTask } from "../app/actions/taskActions";

export function Column({
  column,
  index,
  refreshBoard,
}: {
  column: ColumnType;
  index: number;
  refreshBoard: () => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createTask({
        ...taskData,
        priority: taskData.priority || Priority.LOW,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
      });
      await refreshBoard();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-100 p-4 rounded-lg shadow-md w-64"
        >
          <h2 className="text-lg font-bold mb-4" {...provided.dragHandleProps}>
            {column.title}
          </h2>
          <Droppable droppableId={column.id} type="TASK">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {column.tasks.map((task, index) => (
                  <Card
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    onDelete={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    onClick={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            New Task
          </button>
          {isModalOpen && (
            <CardModal
              mode="create"
              task={{
                id: "",
                title: "",
                description: "",
                priority: Priority.LOW,
                status: "TODO",
                dueDate: undefined,
                userId: null,
                columnId: column.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onClose={() => setIsModalOpen(false)}
              refreshBoard={refreshBoard}
              onSubmit={handleCreateTask}
              onDelete={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}
