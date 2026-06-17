---
name: recurring-issues
description: Bug patterns and anti-patterns observed in reviews of this codebase
metadata:
  type: project
---

## First full review (2026-06-17) — findings to watch for in future PRs

### API route validation gaps (systemic pattern)
- POST /api/issues passes raw `body` to `store.create()` without stripping unknown fields or validating `status` is a valid Status value. Any extra fields in body will be ignored by the store but the pattern is unsafe for future store changes.
- PATCH /api/issues/[id] passes raw `body` directly to `store.update()` with no field validation whatsoever — callers can send arbitrary keys.
- PUT /api/columns/[status]/reorder casts `status as Status` without checking it is a valid STATUSES key. An invalid status string will silently create phantom order entries in the store.
- Validator function keyed on STATUSES should be the standard fix pattern: `STATUSES.some(s => s.key === val)`.

### Missing error handling in Board.tsx fetch calls
- `useEffect` initial fetch (line 39) has no `.catch()` — a network failure leaves `loading` stuck at `true` forever.
- `handleAdd` and `handleDragEnd` are async with `await api(...)` but have no try/catch — unhandled promise rejections on network errors, no user feedback.
- `handleStatusChange` has no try/catch — on failure the local state reflects the change (from the API call) but the store actually didn't update; no rollback.

### handleDragEnd stale closure bug
- `handleDragEnd` reads `byStatus[to]` (line 106) which is derived from the closure-captured `byStatus` snapshot at render time. After `handleDragOver` mutates state mid-drag, `byStatus` in the closure may be stale. Should read from the functional updater pattern or derive the column fresh from current state inside the handler.

### store.update() unsafe patch
- Accepts `Partial<Pick<Issue, ...>>` but any caller can pass `{ order: -999 }` or `{ status: "nonexistent" }` — no runtime validation of the Status union or order range.

### IssueCard stopPropagation only on pointerDown
- The select's `onPointerDown` stops propagation to prevent drag activation, but `onChange` on the select fires an async `onStatusChange` that has no try/catch and no optimistic rollback. If the PATCH fails, the select snaps back to old value on next render but the user sees no error.

### CSS: no responsive layout
- `.board` uses `grid-template-columns: repeat(4, 1fr)` with no media query — will overflow on narrow viewports.
