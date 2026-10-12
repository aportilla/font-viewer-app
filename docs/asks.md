# Asks

What the Font Viewer has asked of its sibling repos and still waits on. Each
ask is a doc in the receiving repo's `feature-requests/`, written from here.
That folder isn't tracked in those repos, so the docs live on this machine
alone, and this list keeps what changes here when each one ships.

**At each system-online-sdk release**, check it against this list (`npm view
system-online-sdk version`, and the SDK's log since the range here). Take up
here what it shipped, as each entry says, and strike the entry.

## Waiting

### SystemOnline: `font-viewer-app-file.md`

Step 3 of `docs/system-fonts-plan.md`: fonts are the system's, and the Font
Viewer only views them. Both things it waited on are done: the SDK's
release, 0.2.0, and the Font Viewer 0.2.0 built on it.

Rewritten 2026-10-11 for system fonts. SystemOnline moves onto the release,
gives its system its collection and a Fonts folder, moves existing desktops'
suitcases into it, and builds the Font Viewer in from `apps/Font
Viewer.png`. Its own copy goes; the collection stays there. Until then the
desktop runs that copy, so a change made here reaches it only with that
step.

When it's done, here: nothing changes. Strike the entry.

## Shipped

- system-online-sdk: `system-fonts.md`, in 0.2.0, 2026-10-11. The Fonts
  folder, the shell's `font` kind, `opens`, `createShell({ fonts })` and
  `ctx.fonts`. Taken up here as the Font Viewer 0.2.0 (the plan's step 2).
  The request stays in the SDK until SystemOnline has moved too.

## Withdrawn

- system-online-sdk: `app-file-assets.md`, 2026-10-11. Files beside an app
  file's code, for the strikes the Font Viewer carried, which left it at
  the plan's step 2.
- system-online-sdk: `alert-sized-to-message.md`, 2026-10-11. The Font
  Viewer's alert is its own, sized by `src/alert.ts`.
