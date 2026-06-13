# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # install dependencies
bun run dev        # start dev server at http://localhost:3000
bun run build      # production build
bun run typecheck  # type-check without emitting (tsc --noEmit)
```

No test suite is configured.

## Architecture

This is a minimal Next.js 15 kanban board with an in-memory store — **all data resets on server restart**.

### Data layer (`lib/`)

- `lib/types.ts` — defines `Issue`, `Status`, and the ordered `STATUSES` array that drives column rendering throughout the app.
- `lib/store.ts` — a singleton `IssueStore` backed by a `Map<string, Issue>`. It is attached to `globalThis` so Next.js hot-reloads in dev don't reset it. The store is the only source of truth; there is no database.

### API routes (`app/api/`)

Plain Next.js Route Handlers that delegate directly to `store`:

| Method | Path | Action |
|--------|------|--------|
| GET/POST | `/api/issues` | list / create |
| GET/PATCH/DELETE | `/api/issues/[id]` | single issue |
| PUT | `/api/columns/[status]/reorder` | bulk reorder a column |

### UI (`app/`, `components/`)

All UI is client-side (`"use client"`). `Board.tsx` owns all state and data-fetching; `Column` and `IssueCard` are presentational.

- **Drag-and-drop** uses `@dnd-kit/core` + `@dnd-kit/sortable`. `handleDragOver` in `Board` does an optimistic local status move; `handleDragEnd` fires `PUT /api/columns/:status/reorder` to persist the final order.
- **Status change via dropdown** in `IssueCard` calls `PATCH /api/issues/:id` and updates local state optimistically.
- `Board` derives `byStatus` (a `Record<Status, Issue[]>`) from the flat `issues` array via `useMemo`, sorted by `issue.order`.

### Styling

Global CSS only (`app/globals.css`). No CSS modules or utility framework.
