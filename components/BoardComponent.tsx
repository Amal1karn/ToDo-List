"use client";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "./Column";
import { ColumnType, Task } from "../types";
import { updateTaskStatus } from "../app/actions/taskActions";
import { useEffect, useState } from "react";
import { Status } from "@prisma/client";

// Define static columns based on Status enum
const BOARD_COLUMNS: ColumnType[] = [
  { id: Status.TODO, title: "To Do", tasks: [] },
  { id: Status.IN_PROGRESS, title: "In Progress", tasks: [] },
  { id: Status.DONE, title: "Done", tasks: [] },
];

export function Board({ columns: initialColumns }: { columns: ColumnType[] }) {
  // Merge static columns with initial columns
  const mergedColumns = BOARD_COLUMNS.map((staticColumn) => {
    const matchingColumn = initialColumns.find(
      (col) => col.id === staticColumn.id
    );
    return {
      ...staticColumn,
      tasks: matchingColumn ? matchingColumn.tasks : [],
    };
  });

  const [columns, setColumns] = useState(BOARD_COLUMNS);

  useEffect(() => {
    setColumns(mergedColumns);
  }, []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const oldColumnId = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    )?.id;

    const newColumnId = over.id;

    if (oldColumnId && newColumnId && oldColumnId !== newColumnId) {
      // Update columns state
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== active.id),
        }));

        const movedTask = prevColumns
          .flatMap((col) => col.tasks)
          .find((task) => task.id === active.id);

        if (movedTask) {
          const targetColumnIndex = newColumns.findIndex(
            (col) => col.id === newColumnId
          );
          newColumns[targetColumnIndex].tasks.push({
            ...movedTask,
            status: newColumnId as Status,
          });
        }

        return newColumns;
      });

      // Update task status in the database
      await updateTaskStatus(active.id, newColumnId as Status);
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto p-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="bg-white p-2 rounded shadow">Moving task...</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
