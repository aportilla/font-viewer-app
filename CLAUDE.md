# Font Viewer

The font suitcase viewer, an application for SystemOnline (the sibling
`system-online` repo). It runs on `system-online-sdk`'s shell over the
`vintage-frames` kit's elements, both sibling repos too. It ships as one
file, its app file `Font Viewer.png`, which SystemOnline builds in from its
`apps/`; it came out of SystemOnline's `src/apps/font-viewer/`, the third
application to leave, after Meteors and Desktop Patterns (the sibling
`meteors-app` and `desktop-patterns-app`, the models for this repo). **Fonts
are the system's**, not the viewer's: a site serves them, a suitcase in
System Folder → Fonts installs its family, and the viewer reaches them
through `ctx.fonts` (`docs/system-fonts-plan.md`). It carries no strikes;
SystemOnline keeps the collection, its pipeline and its guide. The SDK
writes the file: its
`system-online-sdk/build` entry holds the frame, the packer and the
`appFile()` Vite plugin, so this repo carries neither frame nor packer. The
SDK's docs (`../system-online-sdk/docs/`) are the guides: `GUIDE.md` for an
application in a repo of its own, `SHELL.md` for the shell, `APP-FILES.md`
for the format.

## Commands

- `npm run dev` — the dev desktop (`index.html`, `dev/main.ts`), whose
  system serves four families borrowed from SystemOnline (`dev/fonts.ts`);
  `?save=1` keeps its catalog and session across a reload
- `npm run build` — the app file, `dist/Font Viewer.png`, through the SDK's
  `appFile()` (`vite.config.ts`). The release is that file, copied into
  SystemOnline's `apps/`
- The gates: `npm test`, `npm run typecheck`, `npm run build`. CI runs all
  three on every push and pull request.

## Tests

Unit tests only, and only for pure logic (`test/*.test.mjs`, run by
`node --test`, importing the TypeScript source through Node's type
stripping). No browser tests, and nothing that asserts markup, copy,
constants or what the kit or the SDK renders: the look and the wiring are
checked by eye, on the dev desktop. A module under test imports no DOM,
nothing of either package but `system-online-sdk/pure`, and no `?raw`, and
its relative imports carry their `.ts` extension.

## What an application in an app file relies on

The app file's code goes into a page that brings its own copy of the kit and
the SDK, so:

- **Imports**: `vintage-frames`, `system-online-sdk`,
  `system-online-sdk/pure` and its own files. It composes the kit's
  elements and brings no Lit of its own. The build leaves those three entries
  as imports, and fails on any other import, on Lit, and on CSS.
- **Art** is imported, so the build inlines it. No page paths.
- **Fonts are the system's**, reached through `ctx.fonts`: a suitcase's
  family by `family()`, and each strike loaded by `load()`, which resolves
  the font-family to set or null when it didn't load. It carries no strikes
  and loads no font itself. A page older than SDK 0.2.0 has no `ctx.fonts`,
  so the viewer checks for it and opens nothing there.
- **Layout** sits on its own elements. No site stylesheet, and no CSS
  import: the specimen's smoothing token and the rows' breaking are style
  attributes on its stacks (`windows.html`).
- **Its alert is its own**, composed from the kit's elements in
  `dialogs.html` with its own art, and grown to its message by `src/alert.ts`
  after vintage-frames' LAYOUT.md alert recipe. The shell only shows it
  (`ctx.ask`). An application's alerts and messages are its to compose:
  never ask the SDK to supply, fill or size them.
- **No session keys of its own.** A font window's item is its suitcase, so
  the session reopens it, and nothing breaks when `ctx.state` is null.
- **Nothing site-specific through the context**: no `ctx.services`, and no
  `ctx.apps`.
- **It owns no kind.** A font suitcase is the shell's `font` kind
  (`FONT_KIND`, `fontFamilyOf()`), with the shell's art and size, and the
  Font Viewer says it opens it (`opens: [FONT_KIND]`), so the shell hands it
  each suitcase through `open({ item, from })`. Any kind it adds is named
  after its id. The suitcases are the site's to seed; one opens wherever it
  is, installed or not, and one whose family the system doesn't serve says
  so in the viewer's alert.
- **Its id never changes** (`font-viewer`): saved windows name it.
  SystemOnline puts no icon of it on the desktop, since it opens from its
  suitcases; its icon is the manifest's and the box's.
- **Each manifest field has one source**: `id`, `name`, `version`, `author`
  and `description` from `src/app.ts`; `requires` from the range of the
  `system-online-sdk` dev dependency, and `api` from the SDK it's built on;
  the icon from `src/art/font-viewer.png`. `package.json` carries no version
  of its own for that reason.
- **Each SDK minor** moves the `system-online-sdk` range, and
  `vintage-frames` to the range the SDK's peer dependency names, gets a look
  at the viewer on the new SDK, and a build. The Font Viewer is at 0.x: a
  minor when the range moves, a patch for the viewer alone. The SDK's
  `GUIDE.md` § Moving to a new release has the steps.

`dev/` is the dev desktop's alone and never goes into the app file; it may
borrow SystemOnline's art and a few of its fonts (`dev/fonts/`), and gives
its system those fonts and a Fonts folder as a site does.

## Invariants — don't break, don't re-litigate

- **Never reach into the SDK's or the kit's internals.** Import their
  published entries only, never a deep path into either's `dist/`. What the
  viewer needs and they don't do is a change to them, asked for as a doc in
  `feature-requests/<name>.md`, never worked around here: in the sibling
  `system-online-sdk` repo for the shell or app files, in the sibling
  `vintage-frames` repo for an element, in the sibling `system-online` repo
  for the site. `docs/asks.md` keeps what changes here when each ships.
- **Two kinds of type, kept apart.** `VF Display`/`VF Body` come from the
  kit and are its *own re-drawn strikes* — credit Susan Kare and Apple as
  the original designers, never call them Apple's files. The strikes the
  viewer shows are the opposite: genuine Apple strikes under their own
  names, SystemOnline's collection (its `docs/FONTS.md`), of which
  `dev/fonts/` borrows four families. Never describe one as the other.
- Everything is authored in **system pixels** on the 1-bit grid. A strike
  renders one design px per system px: its paragraph carries the strike's
  rect as the size and its measured pitch as the line height.
- `dist/` is a build output — regenerate, don't hand-edit.
- Comments are short and direct: label a section or state a non-obvious
  constraint. A larger change starts as a plan in `docs/<topic>-plan.md`.

## Commits

Concise messages: a summary line plus at most a few sentences. No co-author
or generated-by trailers.
