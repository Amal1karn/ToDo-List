"use client";
import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnType, Task, Priority } from "@/types";
import { Card } from "./Card";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ColumnProps {
  column: ColumnType;
  onCreateTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => Promise<void>;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onCreateTask(column.id, {
        title: newTaskTitle.trim(),
        description: "",
        priority: Priority.MEDIUM,
      });
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-80 flex-shrink-0 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        {column.title}
      </h2>
      {isAddingTask ? (
        <form onSubmit={handleAddTask} className="mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full mb-4 p-2 text-gray-600 border border-dashed border-gray-300 rounded hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Task
        </button>
      )}
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px] space-y-2"
          >
            {column.tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEditTask(task)}
                onDelete={() => task.id && onDeleteTask(task.id, column.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
