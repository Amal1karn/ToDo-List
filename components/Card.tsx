"use client";
import { useState } from "react";
import { CardModal } from "./CardModal";
import { CardProps, Priority } from "../types";

export function Card({ task, onDelete, onUpdate }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-red-100 text-red-800";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case Priority.LOW:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-md shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      {isModalOpen && (
        <CardModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onSave={onUpdate}
          onDelete={onDelete}
          mode="edit"
        />
      )}
    </>
  );
}
