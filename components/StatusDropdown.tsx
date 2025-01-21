import React, { useState } from "react";
import axiosInstance from "@/utils/axios";

type TaskStatus = "To Do" | "In Progress" | "Completed";

interface StatusDropdownProps {
  currentStatus: TaskStatus;
  onChange: (newStatus: TaskStatus) => void;
  idTask: string;
  idProject: string;
}
//ss
const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onChange, idTask, idProject }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const statuses: TaskStatus[] = ["To Do", "In Progress", "Completed"];

  const availableStatuses = statuses.filter((status) => status !== currentStatus);

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
    try {
      await axiosInstance.put(`/api/tasks/${idTask}`, {
        status: newStatus,
        project_id: idProject,
      });

      onChange(newStatus);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className={`text-white h-8 w-32 flex justify-center items-center rounded-md ${
          {
            "To Do": "bg-cusRed",
            "In Progress": "bg-cusBlue",
            Completed: "bg-cusGreen",
          }[currentStatus] || ""
        }`}
      >
        {currentStatus}
      </button>

      <div
        className={`left-0 w-full z-10 transition-all duration-300 ease-in-out ${
          isDropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {availableStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleUpdateStatus(status)}
            className={`block w-full rounded-md mt-2 py-2 px-4 text-center text-white bg-slate-500 hover:bg-slate-400 transition ${
              status === "To Do" ? "text-gray-400 cursor-not-allowed hidden" : ""
            }`}
            disabled={status === "To Do"}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusDropdown;
