"use client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnType, Task } from "@/types";
import { Card } from "./Card";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ColumnProps {
  column: ColumnType;
  onCreateTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => Promise<void>;
  onCardClick: (task: Task) => void; // Add onCardClick prop
  onAddTaskClick: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onEditTask,
  onDeleteTask,
  onCardClick, // Add onCardClick prop
  onAddTaskClick,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-80 flex-shrink-0 shadow-md h-[calc(100vh-200px)] ml-32">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        {column.title}
      </h2>
      <button
        onClick={() => onAddTaskClick(column.id)}
        className="w-full mb-4 p-2 text-gray-600 border border-dashed border-gray-300 rounded hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Task
      </button>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-[100px] space-y-2 ${
              snapshot.isDraggingOver ? "bg-blue-100" : ""
            }`}
          >
            {column.tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEditTask(task)}
                onDelete={() => task.id && onDeleteTask(task.id, column.id)}
                onClick={() => onCardClick(task)} // Pass onCardClick to Card
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
