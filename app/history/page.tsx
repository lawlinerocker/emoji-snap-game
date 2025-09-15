"use client";
import { useEffect, useState } from "react";
import { loadHistory, clearHistory } from "@/lib/storage";
import { HistoryItem } from "@/lib/types/history.types";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">History</h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="btn btn-sm btn-danger">
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 && <p className="opacity-70">No history yet.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            {it.dataUrl ? (
              <img
                src={it.dataUrl}
                alt="snap"
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200" />
            )}
            <div className="p-3 text-sm flex items-center justify-between">
              <span className="text-2xl">{it.emoji}</span>
              <span
                className={`badge ${
                  it.passed
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-red-100 dark:bg-red-900/40"
                }`}
              >
                {it.passed ? "Passed" : "Failed"}
              </span>
            </div>
            <div className="px-3 pb-3 text-xs opacity-70">
              {new Date(it.ts).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
