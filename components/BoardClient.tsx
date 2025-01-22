// BoardClient.tsx
"use client";

import { useState } from "react";
import { Board } from "./BoardComponent";
import { BoardClientProps, Tab } from "../types";

const tabs: Tab[] = [
  { name: "Overview", id: "overview" },
  { name: "Boards", id: "boards" },
  { name: "Reports", id: "reports" },
];

const TabButton: React.FC<{
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 ${
      isActive ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
    }`}
  >
    {tab.name}
  </button>
);

export function BoardClient({ initialColumns }: BoardClientProps) {
  const [activeTab, setActiveTab] = useState<string>("boards");

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <main className="p-4">
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center h-full">
          {activeTab === "overview" && <div>Overview Content</div>}
          {activeTab === "boards" && <Board columns={initialColumns} />}
          {activeTab === "reports" && <div>Reports Content</div>}
        </div>
      </main>
    </div>
  );
}
