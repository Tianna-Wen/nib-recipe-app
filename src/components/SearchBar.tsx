"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Trigger search on Enter key
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mb-2">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter the name of a meal to search for a recipe..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
}
