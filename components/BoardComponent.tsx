"use client";

import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { ColumnType, Task } from "@/types";

interface BoardProps {
  columns: ColumnType[];
  onDragEnd: (result: DropResult) => void;
  onCreateTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, columnId: string) => Promise<void>;
  onCardClick: (task: Task) => void; // Add onCardClick prop
  onAddTaskClick: (columnId: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  columns,
  onDragEnd,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onCardClick, // Add onCardClick prop
  onAddTaskClick,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onCardClick={onCardClick} // Pass onCardClick to Column
            onAddTaskClick={onAddTaskClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
