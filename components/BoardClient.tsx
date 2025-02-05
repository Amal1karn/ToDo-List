"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { ColumnType, Task, Priority } from "@/types";
import { Board } from "./BoardComponent";
import { CardModal } from "./CardModal";
import {
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "@/app/actions/taskActions";

export const BoardClient: React.FC<{ initialColumns: ColumnType[] }> = ({
  initialColumns,
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Function to handle card click and open the modal in edit mode
  const handleCardClick = (task: Task) => {
    setActiveTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Function to handle adding a new task and open the modal in create mode
  const handleAddTaskClick = (columnId: string) => {
    setActiveTask({
      title: "",
      description: "",
      priority: Priority.LOW,
      columnId,
    } as Task);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Function to handle drag and drop events
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startColumn = columns.find((col) => col.id === source.droppableId);
    const finishColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!startColumn || !finishColumn) return;

    if (startColumn === finishColumn) {
      const newTasks = Array.from(startColumn.tasks);
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      const newColumn = {
        ...startColumn,
        tasks: newTasks,
      };

      setColumns((prevColumns) =>
        prevColumns.map((col) => (col.id === newColumn.id ? newColumn : col))
      );
    } else {
      const startTasks = Array.from(startColumn.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks,
      };

      const finishTasks = Array.from(finishColumn.tasks);
      finishTasks.splice(destination.index, 0, movedTask);
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks,
      };

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === newStartColumn.id
            ? newStartColumn
            : col.id === newFinishColumn.id
            ? newFinishColumn
            : col
        )
      );

      try {
        await moveTask(draggableId!, destination.droppableId);
      } catch (error) {
        console.error("Failed to move task:", error);
      }
    }
  };

  // Function to handle creating a new task
  const handleCreateTask = async (
    columnId: string,
    taskData: Partial<Task>
  ) => {
    if (!taskData.title || taskData.title.trim() === "") {
      console.error("Title is required to create a task.");
      return;
    }

    try {
      const newTask = await createTask({
        title: taskData.title.trim(),
        description: taskData.description || "",
        priority: taskData.priority || Priority.MEDIUM,
        columnId,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : undefined,
      });

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId
            ? { ...column, tasks: [newTask, ...column.tasks] }
            : column
        )
      );
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // Function to handle editing a task
  const handleEditTask = (task: Task) => {
    setActiveTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Function to handle updating a task
  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!activeTask) return;
    try {
      const updatedTask = await updateTask(activeTask.id!, {
        ...activeTask,
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        description: taskData.description ?? activeTask.description, // Ensure description is included
      });
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === activeTask.id ? updatedTask : task
          ),
        }))
      );
      setIsModalOpen(false);
      setActiveTask(null);
      await refreshBoard();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId: string, columnId: string) => {
    try {
      await deleteTask(taskId);
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== taskId),
              }
            : column
        )
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Function to refresh the board (placeholder)
  const refreshBoard = async () => {
    console.log("Refreshing board...");
  };

  // Function to handle form submission in the modal
  const handleSubmit = async (taskData: Partial<Task>) => {
    if (modalMode === "create" && activeTask) {
      await handleCreateTask(activeTask.columnId, taskData);
    } else if (modalMode === "edit" && activeTask) {
      await handleUpdateTask(taskData);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Board
          columns={columns}
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCardClick={handleCardClick} // Pass handleCardClick to Board
          onAddTaskClick={handleAddTaskClick}
          onDragEnd={onDragEnd} // Ensure onDragEnd is passed correctly
        />
      </DragDropContext>
      {isModalOpen && activeTask && (
        <CardModal
          task={activeTask}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit} // Ensure handleSubmit is passed correctly
          mode={modalMode}
          onDelete={() => handleDeleteTask(activeTask.id!, activeTask.columnId)}
          refreshBoard={refreshBoard}
        />
      )}
    </>
  );
};

export default BoardClient;
