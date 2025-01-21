"use client";

import React, { useState } from "react";
import AddProjectForm from "@/components/AddProjectForm";
import ProjectListComponent from "@/components/ProjectListComponent";
import Image from "next/image";

interface Project {
  id?: string;
  name: string;
  description: string;
}
//ss
export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleCreateProject = (data: Project) => {
    console.log("Project created:", data);
  };

  return (
    <div className="w-full flex flex-col items-center h-screen overflow-hidden pt-2 gap-2">
      <div className="w-full max-w-[440px] px-8 md:pl-2 md:pr-4 mb-8">
        <span className="text-white text-4xl font-bold">Get Things Done</span>
        <br />
        <span className="text-cusRed text-sm">Simplify your life, one task at a time.</span>
      </div>
      <div className="w-full h-full rounded-lg max-w-[440px] pt-2 px-8 md:pl-2 md:pr-4 relative overflow-y-auto">
        <Image
          onClick={() => setIsProjectModalOpen(true)}
          src="/create.png"
          alt="Create Project"
          width={50}
          height={50}
          className="object-contain fixed bottom-4 right-4 md:hidden bg-white rounded-full border-2"
        />

        <AddProjectForm isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSubmit={handleCreateProject} />

        <ProjectListComponent />
      </div>
      <button
        onClick={() => setIsProjectModalOpen(true)}
        className="bg-cusRed hidden md:block text-white font-bold pt-1 py-2 px-4 h-fit rounded-t-xl w-full max-w-[440px]"
      >
        Create Project
      </button>
    </div>
  );
}
