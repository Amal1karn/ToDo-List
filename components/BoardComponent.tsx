"use client";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { ColumnType } from "../types";
import { moveTask, getColumnsWithTasks } from "../app/actions/taskActions";
import { useState, useCallback } from "react";

export function Board({ columns: initialColumns }: { columns: ColumnType[] }) {
  console.log(
    "Initial columns in Board:",
    JSON.stringify(initialColumns, null, 2)
  );
  const [columns, setColumns] = useState(initialColumns);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) {
        return;
      }

      const sourceColumnId = source.droppableId;
      const destinationColumnId = destination.droppableId;

      if (sourceColumnId !== destinationColumnId) {
        setColumns((prevColumns) => {
          const newColumns = prevColumns.map((column) => {
            if (column.id === sourceColumnId) {
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== draggableId),
              };
            }
            if (column.id === destinationColumnId) {
              const movedTask = prevColumns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === draggableId);
              if (movedTask) {
                return {
                  ...column,
                  tasks: [
                    ...column.tasks.slice(0, destination.index),
                    { ...movedTask, columnId: destinationColumnId },
                    ...column.tasks.slice(destination.index),
                  ],
                };
              }
            }
            return column;
          });
          return newColumns;
        });

        try {
          await moveTask(draggableId, destinationColumnId);
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

  if (!columns || columns.length === 0) {
    return <div>No columns to display</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex space-x-4 overflow-x-auto p-4"
          >
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                index={index}
                refreshBoard={refreshBoard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
