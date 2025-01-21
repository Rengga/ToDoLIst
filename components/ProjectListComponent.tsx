"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Task {
  id: string;
  project_id: string;
  name: string;
  status: string;
}

const ProjectListComponent: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasksData, setTasksData] = useState<Map<string, Task[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects first
        const projectsResponse = await axiosInstance.get("/api/projects");
        const projects = projectsResponse.data;
        setProjects(projects);

        const tasksPromises = projects.map((project: Project) => axiosInstance.get(`/api/projects/${project.id}/tasks`));

        const tasksResponses = await Promise.all(tasksPromises);

        const tasksMap = new Map<string, Task[]>();
        tasksResponses.forEach((response, index) => {
          tasksMap.set(projects[index].id, response.data);
        });
        setTasksData(tasksMap);
      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const countTasksByStatus = (tasks: Task[]) => {
    const counts = { "To Do": 0, "In Progress": 0, Completed: 0 };

    tasks.forEach((task) => {
      if (task.status === "To Do") {
        counts["To Do"] += 1;
      } else if (task.status === "In Progress") {
        counts["In Progress"] += 1;
      } else if (task.status === "Completed") {
        counts["Completed"] += 1;
      }
    });

    return counts;
  };

  const handleProjectClick = (projectName: string) => {
    localStorage.setItem("selectedProject", projectName);
  };

  if (loading) {
    return (
      <div className="w-full flex-col flex gap-4">
        <div className="bg-cusGrey p-4 rounded-2xl h-[131px] loading"></div>
        <div className="bg-cusGrey p-4 rounded-2xl h-[131px] loading"></div>
        <div className="bg-cusGrey p-4 rounded-2xl h-[131px] loading"></div>
        <div className="bg-cusGrey p-4 rounded-2xl h-[131px] loading"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-fit gap-4 pb-4">
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => {
            const tasks = tasksData.get(project.id) || [];
            const taskCounts = countTasksByStatus(tasks);

            return (
              <div key={project.id} className="w-full h-fit">
                <Link href={`/projects/${project.id}/tasks`} onClick={() => handleProjectClick(project.name)}>
                  <div className="bg-cusGrey p-4 rounded-2xl">
                    <div className="flex justify-between mb-4">
                      <div className="font-semibold text-xl text-white md:max-w-[152px] truncate">{project.name}</div>
                      <div className="hidden md:block">
                        <div className="flex h-fit gap-3 mb-2">
                          <div className="flex h-fit w-fit text-cusRed gap-1 items-center">
                            <Image src="/task.svg" alt="" width={20} height={20} className="object-contain" />
                            <div className="h-[25px] text-end">: {taskCounts["To Do"]}</div>
                          </div>
                          <div className="flex h-fit w-fit text-cusBlue gap-1 items-center">
                            <Image src="/progress.svg" alt="" width={20} height={20} className="object-contain" />
                            <div className="h-[25px] text-end">: {taskCounts["In Progress"]}</div>
                          </div>
                          <div className="flex h-fit w-fit text-cusGreen gap-1 items-center">
                            <Image src="/completed.svg" alt="" width={20} height={20} className="object-contain" />
                            <div className="h-[25px] text-end">: {taskCounts["Completed"]}</div>
                          </div>
                        </div>
                        <p className="text-white text-sm text-end">Total Tasks: {tasks.length}</p>
                      </div>
                    </div>
                    <div className="text-gray-400  flex text-sm items-end">{project.description}</div>
                    <div className="flex justify-between items-center md:hidden mt-4 border-t pt-2 border-slate-500">
                      <div className="flex h-fit gap-3">
                        <div className="flex h-fit w-fit text-cusRed gap-1 items-center">
                          <Image src="/task.svg" alt="" width={16} height={16} className="object-contain" />
                          <div className="h-[22px] text-end text-sm">: {taskCounts["To Do"]}</div>
                        </div>
                        <div className="flex h-fit w-fit text-cusBlue gap-1 items-center">
                          <Image src="/progress.svg" alt="" width={16} height={16} className="object-contain" />
                          <div className="h-[22px] text-end text-sm">: {taskCounts["In Progress"]}</div>
                        </div>
                        <div className="flex h-fit w-fit text-cusGreen gap-1 items-center">
                          <Image src="/completed.svg" alt="" width={16} height={16} className="object-contain" />
                          <div className="h-[22px] text-end text-sm">: {taskCounts["Completed"]}</div>
                        </div>
                      </div>
                      <p className="text-white text-sm text-end">Total Tasks: {tasks.length}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectListComponent;
