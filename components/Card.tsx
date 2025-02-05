"use client";

//client side and server side

import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import {
  CalendarIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DeleteButton from "./DeleteButton";

interface CardProps {
  //typescript type definition
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void; // Add onClick prop
}

export const Card: React.FC<CardProps> = ({
  //props react
  task,
  index,
  onEdit,
  onDelete,
  onClick, // Add onClick prop
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string | Date | null) => {
    if (!date) return null;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Draggable draggableId={task.id || " "} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={onClick} // Handle card click to open edit mode
        >
          <h3 className="font-bold text-lg mb-2 text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3">
              {isExpanded
                ? task.description
                : truncateDescription(task.description, 100)}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span
                className={`capitalize px-2 py-1 rounded ${
                  task.priority === "HIGH"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority}
              </span>
            </div>
            {task.dueDate && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-end items-center">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4" />
              </button>

              <DeleteButton onDelete={onDelete} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
