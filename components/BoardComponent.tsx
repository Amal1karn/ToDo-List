"use client";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { ColumnType } from "../types";
import { moveTask, getColumnsWithTasks } from "../app/actions/taskActions";
import { useState, useCallback } from "react";

export function Board({ columns: initialColumns }: { columns: ColumnType[] }) {
  console.log("Initial columns in Board:", initialColumns);
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const oldColumnId = columns.find((col) =>
        col.tasks.some((task) => task.id === activeId)
      )?.id;
      const newColumnId = overId;

      if (oldColumnId && newColumnId && oldColumnId !== newColumnId) {
        setColumns((prevColumns) => {
          const newColumns = prevColumns.map((column) => {
            if (column.id === oldColumnId) {
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== activeId),
              };
            }
            if (column.id === newColumnId) {
              const movedTask = prevColumns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === activeId);
              if (movedTask) {
                return {
                  ...column,
                  tasks: [
                    ...column.tasks,
                    { ...movedTask, columnId: newColumnId },
                  ],
                };
              }
            }
            return column;
          });
          return newColumns;
        });

        try {
          await moveTask(activeId, newColumnId);
        } catch (error) {
          console.error("Failed to update task status:", error);
          // Optionally, revert the UI change here if the API call fails
        }
      }
    },
    [columns]
  );

  const refreshBoard = useCallback(async () => {
    try {
      const updatedColumns = await getColumnsWithTasks();
      setColumns(updatedColumns);
    } catch (error) {
      console.error("Failed to refresh board:", error);
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto p-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} refreshBoard={refreshBoard} />
        ))}
      </div>
    </DndContext>
  );
}
