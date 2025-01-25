"use client";
import { useState, useEffect, useRef } from "react";
import { CardModalProps, Priority } from "../types";

export function CardModal({
  task,
  onClose,
  onSave,
  onDelete,
  mode,
}: CardModalProps) {
  const [editedTask, setEditedTask] = useState(task);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSave = async () => {
    await onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-xs flex items-center justify-center z-50 rounded-sm">
      <div ref={modalRef} className="bg-white p-12 rounded-lg w-1/3  shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "create" ? "Create Task" : "Edit Task"}
        </h2>
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
          placeholder="Task Title"
        />
        <textarea
          value={editedTask.description || ""}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
          placeholder="Task Description"
        />
        <select
          value={editedTask.priority}
          onChange={(e) =>
            setEditedTask({
              ...editedTask,
              priority: e.target.value as Priority,
            })
          }
          className="w-full p-2 mb-4 border rounded"
        >
          {Object.values(Priority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={editedTask.dueDate || ""}
          onChange={(e) =>
            setEditedTask({ ...editedTask, dueDate: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end space-x-2">
          {mode === "edit" && onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
