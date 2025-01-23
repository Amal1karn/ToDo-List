"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardModal } from "./CardModal";
import { deleteTask } from "../app/actions/taskActions";
import { CardProps } from "../types";

export function Card({ task, refreshBoard }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        refreshBoard();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className="bg-white p-3 mb-2 rounded shadow cursor-pointer hover:bg-gray-50"
      >
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          x
        </button>
      </div>
      {isModalOpen && (
        <CardModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          refreshBoard={refreshBoard}
          mode={"create"}
        />
      )}
    </>
  );
}
