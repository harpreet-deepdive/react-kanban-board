"use client";
import React from "react";
import kanban from "../../mock/kanban.json";
import KanbanPage from "../Kanban";

const WorkSpace = () => {
  return (
    <div className="bg-primary-50 flex-1  p-4 ">
      <KanbanPage />
    </div>
  );
};

export default WorkSpace;
