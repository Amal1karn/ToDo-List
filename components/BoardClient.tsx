"use client";
import { useState } from "react";
import { Board } from "./BoardComponent";
import { BoardClientProps, Tab } from "../types";

const tabs: Tab[] = [
  { name: "Boards", id: "boards" },
  { name: "Reports", id: "reports" },
];

export function BoardClient({ initialColumns }: BoardClientProps) {
  const [activeTab, setActiveTab] = useState<string>("boards");

  return (
    <div className="p-4">
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center h-full">
        {activeTab === "boards" && <Board columns={initialColumns} />}
        {activeTab === "reports" && <div>Reports Content</div>}
      </div>
    </div>
  );
}
