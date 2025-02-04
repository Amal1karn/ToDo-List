// page.tsx (Server Component)

import { BoardClient } from "../components/BoardClient";
import { getColumnsWithTasks } from "../app/actions/taskActions";
import ErrorBoundary from "../components/ErrorBoundary";
import { testConnection } from "@/lib/prisma";

export default async function Home() {
  await testConnection();

  try {
    console.log("Fetching columns...");
    const columns = await getColumnsWithTasks();
    console.log("Fetched columns:", JSON.stringify(columns, null, 2));

    return (
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-xl text-red-600">
              Something went wrong. Please try again later.
            </div>
          </div>
        }
      >
        <BoardClient initialColumns={columns} />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Failed to fetch board data:", error);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-red-600">
          Error loading board data. Please try again later.
        </div>
      </div>
    );
  }
}
