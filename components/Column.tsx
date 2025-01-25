"use client";
import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { ColumnProps, Task, Status, Priority } from "../types";

export function Column({
  column,
  onDeleteTask,
  onUpdateTask,
  onCreateTask,
}: ColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = async (newTask: Task) => {
    try {
      await onCreateTask({
        title: newTask.title,
        description: newTask.description,
        status: column.id as Status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        userId: newTask.userId,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="bg-stone-200 p-4 rounded-lg shadow-md flex flex-col w-80 h-full ">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto min-h-[500px]"
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    <Card
                      task={task}
                      onDelete={() => onDeleteTask(task.id)}
                      onUpdate={onUpdateTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button
              className="mt-4 p-2 border-2 border-dashed border-white text-white rounded-md hover:bg-neutral-100/75 transition-colors flex items-center justify-center w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        )}
      </Droppable>

      {isModalOpen && (
        <CardModal
          task={{
            id: "",
            title: "",
            description: "",
            status: column.id as Status,
            priority: Priority.MEDIUM,
            dueDate: null,
            userId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateTask}
          mode="create"
        />
      )}
    </div>
  );
}
