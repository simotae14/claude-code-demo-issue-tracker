---
name: codebase-architecture
description: Key files, patterns, and architectural decisions for the demo-issue-tracker kanban app
metadata:
  type: project
---

## Stack
- Next.js 15, React 19, Bun runtime, TypeScript strict mode
- @dnd-kit/core + @dnd-kit/sortable for drag-and-drop
- No database — in-memory singleton `IssueStore` backed by `Map<string, Issue>` in `lib/store.ts`
- Store attached to `globalThis.__issueStore` so dev hot-reloads don't reset it; only in non-production

## Key file responsibilities
- `lib/types.ts` — `Issue`, `Status` union, `STATUSES` array (source of truth for column order/labels)
- `lib/store.ts` — `IssueStore` class; methods: list, get, create, update, delete, reorder, nextOrder (private), seed (private)
- `app/api/issues/route.ts` — GET (list) / POST (create)
- `app/api/issues/[id]/route.ts` — GET / PATCH / DELETE single issue; params are `Promise<{id}>` (Next.js 15 async params)
- `app/api/columns/[status]/reorder/route.ts` — PUT bulk reorder; accepts `{ orderedIds: string[] }`
- `components/Board.tsx` — owns all state (`issues`, `title`, `loading`); derives `byStatus` via useMemo; handles all API calls
- `components/Column.tsx` — presentational; uses `useDroppable` + `SortableContext`
- `components/IssueCard.tsx` — presentational; uses `useSortable`; has status dropdown that calls `onStatusChange`

## Established patterns
- `byStatus` is a `Record<Status, Issue[]>` derived in `useMemo` in Board, sorted by `issue.order`
- API helpers: generic `api<T>()` fetch wrapper in Board.tsx handles 204 vs JSON
- Optimistic updates: handleDragOver mutates status locally; handleDragEnd calls PUT reorder
- handleStatusChange is NOT optimistic — it awaits the PATCH then updates state
- `store.nextOrder(status)` places new issues at max+1 within their column
- All UI components use `"use client"` directive

## Notable design choices
- `store.globalThis` guard only activates in non-production (correct for in-memory store)
- `store.reorder()` silently skips IDs that don't exist in the map (no error thrown)
- `store.update()` uses `Object.assign(issue, patch)` — mutates in place (intentional for Map-based store)
- CSS: global only in `app/globals.css`; no modules or utility framework
