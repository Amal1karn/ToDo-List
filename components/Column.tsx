import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "./Card";
import { ColumnType } from "../types";

export function Column({ column }: { column: ColumnType }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg shadow-md w-64">
      <h2 className="text-lg font-bold mb-4">{column.title}</h2>
      <SortableContext
        items={column.tasks}
        strategy={verticalListSortingStrategy}
      >
        {column.tasks.map((task) => (
          <Card key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
