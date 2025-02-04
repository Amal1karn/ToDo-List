import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors hover:scale-110 duration-500"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
