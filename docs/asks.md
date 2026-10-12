# Asks

What the Font Viewer has asked of its sibling repos and still waits on. Each
ask is a doc in the receiving repo's `feature-requests/`, written from here.
That folder isn't tracked in those repos, so the docs live on this machine
alone, and this list keeps what changes here when each one ships.

**At each system-online-sdk release**, check it against this list (`npm view
system-online-sdk version`, and the SDK's log since the range here). Take up
here what it shipped, as each entry says, and strike the entry.

## Waiting

Nothing.

## Shipped

- system-online-sdk: `system-fonts.md`, in 0.2.0, 2026-10-11. The Fonts
  folder, the shell's `font` kind, `opens`, `createShell({ fonts })` and
  `ctx.fonts`. Taken up here as the Font Viewer 0.2.0 (the plan's step 2).
  Its request was deleted once SystemOnline had moved too.
- SystemOnline: `font-viewer-app-file.md`, 2026-10-11, the plan's step 3.
  SystemOnline moved onto system-online-sdk 0.2.0, serves its collection as
  the system's fonts, files its suitcases in System Folder → Fonts, and
  builds the Font Viewer 0.2.0 in from `apps/Font Viewer.png`; its own copy
  left. Nothing changed here, and its request was deleted.

## Withdrawn

- system-online-sdk: `app-file-assets.md`, 2026-10-11. Files beside an app
  file's code, for the strikes the Font Viewer carried, which left it at
  the plan's step 2.
- system-online-sdk: `alert-sized-to-message.md`, 2026-10-11. The Font
  Viewer's alert is its own, sized by `src/alert.ts`.
