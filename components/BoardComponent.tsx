"use client";
import { useState, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { BoardProps, ColumnType, Task, Status } from "../types";
import {
  updateTaskStatus,
  deleteTask,
  updateTask,
  createTask,
} from "../app/actions/taskActions";

export function Board({ columns: initialColumns }: BoardProps) {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;

      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceColumn || !destColumn) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          const newTasks = Array.from(col.tasks);
          const [movedTask] = newTasks.splice(source.index, 1);
          if (col.id === destColumn.id) {
            newTasks.splice(destination.index, 0, {
              ...movedTask,
              status: destColumn.id as Status,
            });
          }
          return { ...col, tasks: newTasks };
        }
        if (col.id === destColumn.id && sourceColumn.id !== destColumn.id) {
          const newTasks = Array.from(col.tasks);
          const movedTask = sourceColumn.tasks[source.index];
          newTasks.splice(destination.index, 0, {
            ...movedTask,
            status: destColumn.id as Status,
          });
          return { ...col, tasks: newTasks };
        }
        return col;
      });

      setColumns(newColumns);

      try {
        await updateTaskStatus(draggableId, destColumn.id as Status);
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    },
    [columns]
  );

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        }))
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, []);

  const handleUpdateTask = useCallback(async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
      });
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }))
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }, []);

  const handleCreateTask = useCallback(
    async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        const createdTask = await createTask(newTask);
        setColumns((prevColumns) =>
          prevColumns.map((column) =>
            column.id === createdTask.status
              ? {
                  ...column,
                  tasks: [
                    ...column.tasks,
                    {
                      ...createdTask,
                      dueDate: createdTask.dueDate
                        ? createdTask.dueDate.toISOString()
                        : null,
                    },
                  ],
                }
              : column
          )
        );
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    },
    []
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4 h-full">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            onCreateTask={handleCreateTask}
            refreshBoard={() => Promise.resolve()}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
