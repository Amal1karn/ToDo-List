"use client";

import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { CalendarIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./DeleteButton";

interface CardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onClick,
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

  const truncateDescription = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substr(0, maxLength) + "...";

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onClick();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-destructive/20 text-destructive";
      case "MEDIUM":
        return "bg-accent/20 text-accent";
      case "LOW":
        return "bg-secondary/20 text-secondary";
      default:
        return "bg-muted/20 text-muted";
    }
  };

  return (
    <Draggable draggableId={task.id || " "} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`
            p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-300
            border border-border/30
            bg-card hover:bg-accent/30
            shadow-[0_0_8px_rgba(127,90,240,0.3)]
            hover:shadow-[0_0_16px_rgba(127,90,240,0.6)]
            ${snapshot.isDragging ? "scale-105" : ""}
          `}
        >
          <h3 className="font-bold text-lg mb-2 text-card-foreground">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-foreground mb-3">
              {isExpanded
                ? task.description
                : truncateDescription(task.description, 100)}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span
              className={`capitalize px-2 py-1 rounded-full font-semibold ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <div className="flex items-center text-secondary">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-end items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 rounded-full border border-border/20 text-primary hover:bg-primary/20 hover:scale-105 transition-all"
            >
              <PencilIcon className="h-5 w-5" />
            </button>

            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton onDelete={onDelete} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
