"use client";
import React, { useState } from "react";
import { CardModalProps, Priority } from "@/types";
import { updateTask } from "@/app/actions/taskActions";

export const CardModal: React.FC<CardModalProps> = ({
  task,
  onClose,
  onSubmit,
  onDelete,
  mode,
  refreshBoard,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskId = task.id || "";
    const columnId = task.columnId;

    if (columnId === null || columnId === undefined) {
      console.error("Column ID is null or undefined.");
      return;
    }
    const updatedTask = await updateTask(taskId, {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      userId: null,
      columnId: columnId || "",
    });
    onSubmit(updatedTask);
    onClose();
    await refreshBoard();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          {mode === "create" ? "Create Task" : "Edit Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              console.log(description);
            }}
            placeholder="Task Description"
            className="w-full mb-2 p-2 border rounded"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full mb-2 p-2 border rounded"
          >
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            >
              {mode === "create" ? "Create" : "Update"}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
