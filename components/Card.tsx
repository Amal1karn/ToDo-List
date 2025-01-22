"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { CardModal } from "./CardModal";

export function Card({ task }: { task: Task }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className="bg-white p-3 mb-2 rounded shadow cursor-pointer hover:bg-gray-50"
      >
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
      {isModalOpen && <CardModal task={task} onClose={handleCloseModal} />}
    </>
  );
}
