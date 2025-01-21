"use client";
import axiosInstance from "@/utils/axios";
import React, { useState, useEffect } from "react";
import AddTaskForm from "@/components/AddTaskForm";
import StatusDropdown from "@/components/StatusDropdown";
import Image from "next/image";

interface Task {
  id: string;
  name: string;
  status: string;
}

export default function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [idProject, setIdProject] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setIdProject(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (idProject) {
      const fetchTasks = async () => {
        try {
          const response = await axiosInstance.get(`/api/projects/${idProject}/tasks`);
          setTasks(response.data);
        } catch (error: any) {
          console.error("Error fetching tasks:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [idProject]);

  const handleCreateTask = (data: Task) => {
    setTasks((prev) => [...prev, data]);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "border-cusBlue";
      case "to do":
        return "border-cusRed";
      case "completed":
        return "border-cusGreen ";
      default:
        return "";
    }
  };

  const [projectName, setProjectName] = useState<string>("");

  useEffect(() => {
    const storedProjectName = localStorage.getItem("selectedProject");
    if (storedProjectName) {
      setProjectName(storedProjectName);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center max-w-[440px]">
        <div className="w-[362px] h-[48px] .loding bg-cusGrey rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center h-screen overflow-hidden pt-2 gap-2">
      <div className="w-full max-w-[440px] px-8 md:pl-2 md:pr-4 mb-8">
        <span className="text-white text-4xl font-bold">Get Things Done</span>
        <br />
        <span className="text-cusRed text-sm">Simplify your life, one task at a time.</span>
      </div>
      <div className="w-full h-full rounded-lg max-w-[440px] pt-2 px-8 md:pl-2 md:pr-4 relative overflow-y-auto">
        <Image
          onClick={() => setIsTaskModalOpen(true)}
          src="/create.png"
          alt="Create Task"
          width={50}
          height={50}
          className="object-contain fixed bottom-2 right-2 md:hidden z-10 bg-white rounded-full border-2"
        />
        <span className="text-white text-xl">Tasks for Project {projectName}</span>

        <AddTaskForm isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSubmit={handleCreateTask} idProject={idProject || ""} />

        {tasks.length === 0 ? (
          <div className="flex w-full h-1/2 justify-center items-center">
            <p className="text-gray-500 text-center">No tasks here yet. Tap "Create Task" or the "+" button below to add a new one!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {tasks.map((task) => (
              <div key={task.id} className={`w-full border-l-4 rounded-md py-2 px-2 bg-cusGrey flex justify-between items-top ${getStatusClass(task.status)}`}>
                <div className="text-white flex items-center h-8">{task.name}</div>
                <StatusDropdown
                  currentStatus={task.status}
                  onChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  idTask={task.id}
                  idProject={idProject || ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="bg-cusRed hidden md:block text-white font-bold pt-1 py-2 px-4 h-fit rounded-t-xl w-full max-w-[440px]"
      >
        Create Task
      </button>
    </div>
  );
}
