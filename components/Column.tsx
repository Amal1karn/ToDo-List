"use client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnType, Task } from "@/types";
import { Card } from "./Card";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => Promise<void>;
  onCardClick: (task: Task) => void;
  onCreateTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
  onAddTaskClick: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onEditTask,
  onDeleteTask,
  onCardClick,
  onAddTaskClick,
}) => {
  return (
    <div className="bg-popover p-4 rounded-2xl w-80 flex-shrink-0 shadow-lg h-[calc(100vh-200px)] ml-8 border border-border/30 flex flex-col">
      {/* Column header */}
      <h2 className="text-lg font-semibold mb-4 text-card-foreground">
        {column.title}
      </h2>

      {/* Add Task button */}
      <button
        onClick={() => onAddTaskClick(column.id)}
        className="w-full mb-4 p-2 text-card-foreground border border-dashed border-border rounded hover:border-border/60 hover:text-primary flex items-center justify-center transition-colors duration-200"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Task
      </button>

      {/* Tasks list with custom scrollbar */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 min-h-[100px] space-y-2 overflow-y-auto rounded-md transition-colors
              scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-border/20
              ${snapshot.isDraggingOver ? "bg-border/10" : ""}`}
          >
            {column.tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEditTask(task)}
                onDelete={() => task.id && onDeleteTask(task.id, column.id)}
                onClick={() => onCardClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
