"use client";

import React, { useState } from "react";
import axiosInstance from "@/utils/axios";

interface Project {
  name: string;
  description: string;
}

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Project) => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const projectData: Project = {
      name: projectName,
      description: projectDescription,
    };

    try {
      const response = await axiosInstance.post("api/projects", projectData);

      if (response.status == 200) {
        throw new Error("Gagal untuk membuat projek");
      }

      onSubmit(response.data);
      setProjectName("");
      setProjectDescription("");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Gagal untuk membuat projek");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex justify-center items-center">
      <div className="bg-cusGrey p-4 rounded-lg shadow-md w-96">
        <span className="text-3xl font-bold mb-4 text-white">Plan Your Next Move</span>
        <br />
        <span className="text-sm text-cusRed">A clear plan starts here.</span>

        <form onSubmit={handleCreateProject} className="mt-6">
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-white">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-12">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
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
//
export default AddProjectForm;
