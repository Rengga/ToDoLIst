"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axios";

interface Task {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Completed";
}

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Task) => void;
  idProject: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ isOpen, onClose, onSubmit, idProject }) => {
  const [taskName, setTaskName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const taskData: Task = {
      id: "",
      name: taskName,
      status: "To Do",
    };

    try {
      const response = await axiosInstance.post<Task>(`/api/projects/${idProject}/tasks`, taskData);

      if (!response.status.toString().startsWith("2")) {
        throw new Error("Failed to create task");
      }

      onSubmit(response.data);
      setTaskName("");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex justify-center items-center">
      <div className="bg-cusGrey p-4 rounded-lg shadow-md w-96">
        <span className="text-3xl font-bold mb-4 text-white">Set Your Goals</span>
        <br />
        <span className="text-sm text-cusRed">Add tasks that drive your day.</span>

        <form onSubmit={handleCreateTask} className="mt-6">
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-sm font-medium text-white">
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-1">
            <button type="button" onClick={onClose} className="underline text-white py-2 px-4 rounded flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="bg-cusRed text-white py-2 px-4 rounded-full disabled:opacity-50 flex-1">
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
//ss
export default AddTaskForm;
