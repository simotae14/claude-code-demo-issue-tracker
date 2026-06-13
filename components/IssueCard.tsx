"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Issue, Status } from "@/lib/types";
import { STATUSES } from "@/lib/types";

interface Props {
  issue: Issue;
  onStatusChange: (id: string, status: Status) => void;
}

export default function IssueCard({ issue, onStatusChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusConfig = STATUSES.find((s) => s.key === issue.status)!;
  const numStr = `#${String(issue.number).padStart(3, "0")}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="card-number">{numStr}</div>
      <div className="card-title">{issue.title}</div>
      <div
        className="status-badge"
        style={{ color: statusConfig.color, borderColor: `${statusConfig.color}55` }}
      >
        <span className="status-badge-dot" style={{ background: statusConfig.color }} />
        {statusConfig.label}
        <select
          value={issue.status}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(issue.id, e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
