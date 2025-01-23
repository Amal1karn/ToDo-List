"use client";
import { useState } from "react";
import { Task, Status, Priority } from "../types";
import { updateTask, createTask } from "../app/actions/taskActions";

interface CardModalProps {
  task: Task;
  onClose: () => void;
  refreshBoard: () => Promise<void>;
  mode: "create" | "edit";
}

export function CardModal({
  task,
  onClose,
  refreshBoard,
  mode,
}: CardModalProps) {
  const [editedTask, setEditedTask] = useState<Task>({
    ...task,
    // Ensure dueDate is converted to a string for controlled input
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure dueDate is converted back to a Date or null for backend
    const taskData = {
      ...editedTask,
      dueDate: editedTask.dueDate ? new Date(editedTask.dueDate) : null,
    };

    console.log(`Attempting to ${mode} task with data:`, taskData);

    try {
      if (mode === "edit") {
        await updateTask(task.id, taskData);
      } else {
        await createTask({
          ...taskData,
          dueDate: taskData.dueDate
            ? taskData.dueDate.toISOString().split("T")[0]
            : null,
        });
      }
      await refreshBoard();
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} task:`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Task" : "Create New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Task Title"
            required
          />
          <textarea
            name="description"
            value={editedTask.description || ""}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Task Description"
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
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate || ""}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {mode === "edit" ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
