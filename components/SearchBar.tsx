"use client";

export default function SearchBar() {
  return (
    <div className="flex items-center justify-center">
      <input
        type="text"
        placeholder="Search..."
        className="p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
