// page.tsx (Server Component)
// homepage

import { BoardClient } from "../components/BoardClient";
import { getGroupedTasks } from "../app/actions/taskActions";
import ErrorBoundary from "../components/ErrorBoundary";

export default async function Home() {
  try {
    const columns = await getGroupedTasks();
    return (
      <ErrorBoundary
        fallback={<div>Something went wrong. Please try again later.</div>}
      >
        <BoardClient initialColumns={columns} />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Failed to fetch board data:", error);
    // Return a fallback UI or error message
    return <div>Error loading board data. Please try again later.</div>;
  }
}
