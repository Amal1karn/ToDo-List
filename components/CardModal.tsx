"use client";
import { useState } from "react";
import { Task, Status, Priority } from "../types";
import { updateTask } from "../app/actions/taskActions";

interface CardModalProps {
  task: Task;
  onClose: () => void;
}

export function CardModal({ task, onClose }: CardModalProps) {
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task.id, editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            value={editedTask.description || ""}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          >
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          >
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
