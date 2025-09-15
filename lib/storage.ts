import { KEY } from "./enum/historyKey";
import { HistoryItem } from "./types/history.types";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function pushHistory(item: HistoryItem) {
  if (typeof window === "undefined") return;
  try {
    const list = loadHistory();
    list.unshift(item);

    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 500)));
  } catch (e) {
    console.warn("History storage error, flushing:", e);
    try {
      localStorage.removeItem(KEY);
      localStorage.setItem(KEY, JSON.stringify([item]));
    } catch {}
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
