"use client";

import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Issue, Status } from "@/lib/types";
import { STATUSES } from "@/lib/types";
import IssueCard from "./IssueCard";

interface Props {
  status: Status;
  label: string;
  color: string;
  issues: Issue[];
  onStatusChange: (id: string, status: Status) => void;
  onAdd: (status: Status, title: string) => void;
}

export default function Column({ status, label, color, issues, onStatusChange, onAdd }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = newTitle.trim();
    if (!value) return;
    onAdd(status, value);
    setNewTitle("");
    setAdding(false);
  }

  function handleCancel() {
    setNewTitle("");
    setAdding(false);
  }

  const statusConfig = STATUSES.find((s) => s.key === status)!;

  return (
    <div ref={setNodeRef} className={`column ${isOver ? "over" : ""}`}>
      <div className="column-accent" style={{ background: color }} />
      <div className="column-header">
        <span className="column-dot" style={{ background: color }} />
        <span className="column-label">{label}</span>
        <span className="column-count">{issues.length}</span>
      </div>
      <div className="column-issues">
        <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onStatusChange={onStatusChange} />
          ))}
        </SortableContext>
        {issues.length === 0 && <div className="empty">No issues</div>}
      </div>
      <div className="column-add">
        {adding ? (
          <form className="column-add-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              placeholder={`Add to ${statusConfig.label}...`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            />
            <div className="column-add-form-actions">
              <button type="submit" className="column-add-submit" disabled={!newTitle.trim()}>
                Add
              </button>
              <button type="button" className="column-add-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className="column-add-trigger" onClick={() => setAdding(true)}>
            + Add issue
          </button>
        )}
      </div>
    </div>
  );
}
