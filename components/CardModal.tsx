"use client";

import React, { useState, useEffect, useRef } from "react";
import { CardModalProps, Priority } from "@/types";

export const CardModal: React.FC<CardModalProps> = ({
  task,
  onClose,
  onSubmit,
  onDelete,
  mode,
  refreshBoard,
}) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(
    task.priority || Priority.LOW
  );
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || Priority.LOW);
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
  }, [task, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: task.status,
      columnId: task.columnId,
    });
    refreshBoard?.();
    onClose();
  };

  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-[#ff4c4c]/30 text-[#ff4c4c]";
      case Priority.MEDIUM:
        return "bg-[#ffd166]/30 text-[#ffd166]";
      case Priority.LOW:
        return "bg-[#4ef2b5]/30 text-[#4ef2b5]";
      default:
        return "bg-gray-700/30 text-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-[#12142b] to-[#1a1a2e] p-6 rounded-xl shadow-[0_0_25px_rgba(127,90,240,0.7)] max-w-lg w-full text-[#e0e0f8]"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#7f5af0]">
          {mode === "create" ? "Create Task" : "Edit Task"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full p-2 rounded-md border border-[#7f5af0] bg-[#1a1a2e] text-[#c0c0ff]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
              className="w-full p-2 rounded-md border border-[#7f5af0] bg-[#1a1a2e] text-[#c0c0ff]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={`w-full p-2 rounded-md border border-[#7f5af0] bg-[#1a1a2e] text-[#c0c0ff]`}
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded-md border border-[#7f5af0] bg-[#1a1a2e] text-[#c0c0ff]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-[#7f5af0] text-white px-4 py-2 rounded-md hover:bg-[#9f7fff] transition-all"
            >
              {mode === "create" ? "Create" : "Update"}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  refreshBoard?.();
                  onClose();
                }}
                className="bg-[#ff4c4c] text-white px-4 py-2 rounded-md hover:bg-[#ff6b6b] transition-all"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
