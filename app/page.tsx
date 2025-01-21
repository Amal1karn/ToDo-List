"use client";

import { useState } from "react";

const tabs = [
  { name: "Overview", id: "overview" },
  { name: "Boards", id: "boards" },
  { name: "Reports", id: "reports" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] ">
      {/* Main content */}
      <main className="p-4">
        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="flex items-center justify-center h-full">
          {activeTab === "overview" && <div>Overview Content</div>}
          {activeTab === "boards" && <div>Boards Content</div>}
          {activeTab === "reports" && <div>Reports Content</div>}
        </div>
      </main>
    </div>
  );
}
