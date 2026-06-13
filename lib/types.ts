export type Status = "backlog" | "todo" | "in_progress" | "done";

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  status: Status;
  order: number;
  createdAt: string;
}

export const STATUSES: { key: Status; label: string; color: string }[] = [
  { key: "backlog", label: "Backlog", color: "#a855f7" },
  { key: "todo", label: "Todo", color: "#3b82f6" },
  { key: "in_progress", label: "In Progress", color: "#f59e0b" },
  { key: "done", label: "Done", color: "#22c55e" },
];
