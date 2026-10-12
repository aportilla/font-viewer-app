# Plan: fonts are the system's

**Status:** drafted 2026-10-11. The pattern was taken the same day, with
decisions 3 and 4, which came with it; the rest are recommended (§6). Done
2026-10-11, every step the same day: step 1 shipped as system-online-sdk
0.2.0 (`system-fonts.md`), step 2 is the Font Viewer 0.2.0 here, its § 8
checks passed on the dev desktop, and step 3 landed in SystemOnline
(`font-viewer-app-file.md`). Both requests are deleted, and `docs/asks.md`
keeps what they shipped. The ruling: _"the view
app should not OWN the font strike. If a font strike is in the host system -
the viewer app can be used to open and view it. But those fonts on the
system are available for other apps to use as well … we need i think to be
able to formally endow the system with fonts. Perhaps in the system folder
there should be a fixed fonts directory and if font files are placed there
then they can be shared with other apps ( a hypothetical text editor for
example, or as view options in the text reader app )"_

The short version: a Fonts folder in the System Folder, kept like Apple Menu
Items and Startup Items. A suitcase in it is installed, and every
application can set type in its family. The site gives its system the fonts
it serves, the shell owns the suitcase's kind, and `ctx.fonts` hands any
application, an app file's included, the installed families and loads a
strike when asked. The Font Viewer then carries no strikes: it opens a
suitcase and shows the family the system has. SystemOnline keeps its
collection and serves it, as it does today.

## 1. Where things stand

- **The Font Viewer** left SystemOnline for this repo on 2026-10-11, as an
  app file. An app file is one code module: it imports only the kit and the
  SDK, names no page path and may not use `ctx.services`. So it took the
  strike collection along, inlined: 437.5 KB of its code's 475.9 KB. That
  makes the fonts the viewer's, which the ruling rejects. The SDK request
  for files beside an app file's code (`app-file-assets.md`) and
  SystemOnline's request to take the file went on hold the same day.
- **SystemOnline** runs its own copy of the viewer meanwhile. It serves the
  collection from `public/fonts/imported/`, and a family's strikes load when
  its window opens. Its suitcases sit in Macintosh HD → Fonts, an ordinary
  folder. Its built-in viewer registers the `font` kind, its Finder seeds a
  suitcase per family of `CHARSET_FAMILIES`, and a suitcase weighs its
  strikes' bytes (`__FONT_BYTES__`).
- **The SDK** keeps a System Folder holding Apple Menu Items and Startup
  Items, which the shell reads for the Apple menu and for what opens at
  startup (`src/catalog.ts`, `SystemFolders`). It owns two kinds, `app` and
  `alias` (`src/shell.ts`); every other kind is an application's.
- **vintage-frames** already sets text in any face a page registers: a
  paragraph's `--vf-font-family`, `--vf-font-size` and
  `--vf-paragraph-line-height`, with `--vf-font-smoothing: none` for a
  bitmap strike. The viewer does exactly this (`src/windows.ts`). The kit
  needs no change.

The gap is all in the SDK:

1. **No Fonts folder.** Nothing on a desktop means installed.
2. **A suitcase is an application's kind.** Without the Font Viewer the
   Finder hides every suitcase, and no application can open a kind it
   doesn't own.
3. **No way for a site to give its system fonts.** A site hands the shell
   its art, its volumes and its System Folder's names, and nothing about
   fonts.
4. **No fonts for applications.** Nothing hands an application a family's
   strikes or loads one. `ctx.services` could, but an app file may not use
   it.

## 2. What the Mac had

System 7.1 gave the System Folder a Fonts folder. A suitcase in it was
installed, and every application's Font menu listed its family; a suitcase
anywhere else was a file. Opening a suitcase showed the fonts it held, and
opening a font set the sample line, _How razorback-jumping frogs can level
six piqued gymnasts!_, in it: the Font Viewer is that window. System 7.0
kept fonts inside the System file, and System 6 installed them with Font/DA
Mover.

## 3. Design

### 3.1 The Fonts folder

`system: { folder, appleMenu, startup, fonts: 'Fonts' }`: a site that names
it has a Fonts folder in the System Folder, kept as the other two are: never
renamed, moved, copied or trashed, and there at once in a storage seeded
before it. A suitcase directly in it is installed. Dragged out, it's a file,
which the Font Viewer still opens; trashed, its family is uninstalled. A
site that gives fonts but names no Fonts folder has every family installed.
The Finder draws the folder with the site's art, the folder's without it.

### 3.2 A suitcase is the system's

The `font` kind becomes the shell's own, beside `app` and `alias`, under the
same name and with the same data, `{ family }`, so every suitcase a desktop
or a backup holds carries over. The Finder lists suitcases whether or not a
viewer is installed, draws them with the site's art, and weighs one as its
family's strikes, for Empty Trash.

An application doesn't own the kind: it says it opens it (`opens: ['font']`,
say). Opening a suitcase, by a double-click, the Apple menu or Startup
Items, goes to the first application that does, through its
`open({ item, from })`. With none, the Finder says so in an alert of its
own, which a site can answer with its own dialog.

### 3.3 The site endows the system

`createShell({ fonts })` takes the families the site serves. Each names its
strikes, and each strike its size, the font-size that draws it one design px
to the system px, its line pitch, its URL, its bytes and every character it
carries. Whether a family's sizes count points or pixels rides along, for a
Size menu. SystemOnline's `charset-manifest.ts` and `__FONT_BYTES__` already
hold all of it.

Nothing loads at boot. A strike is a file the page fetches when an
application asks for it, as SystemOnline's are today, so a site's boot
download doesn't grow. The SDK ships no fonts, as it ships no art.

Phase 1 is by reference: a suitcase names a family the site serves. One
whose family the site doesn't serve is a file nothing installs, and the
viewer says it can't show it. Fonts a visitor brings need a font file format
and somewhere to keep a file beside its item. The App Store plan's runtime
installs need that same storage, so they come after it, through it (§7).

### 3.4 `ctx.fonts`

Every application gets it, an app file's included:

- the installed families, by name: those of the suitcases directly in Fonts
  that the site serves, each once;
- any family the site serves, installed or not, by name, for the viewer;
- a call that registers a strike once and resolves the name it's registered
  under, or null when it doesn't load, forgetting a failure so a later call
  tries again;
- a notice when the installed families change, torn down with the
  application.

The application sets a strike on its own elements, as the viewer does
today: the shell composes no UI, and a Font menu is the application's to
build. The registration keeps the viewer's weight range, `100 900`: window
content inherits the kit's weight 700, and a face registered at 400 gets a
synthesized bold.

### 3.5 The Font Viewer after

- **It carries no strikes.** `src/strikes/`, `src/strikes.ts`,
  `src/charset-manifest.ts`, the pipeline in `fonts/`,
  `npm run charset-manifest` and `docs/FONTS.md` leave this repo.
  SystemOnline holds the originals of each, so nothing is lost. The app file
  is the viewer alone, tens of KB.
- **It owns no kind.** `src/suitcase.ts` and a suitcase's art
  (`src/art/suitcase.png`) go: the kind and its art are the system's. It
  says it opens `font`.
- **It shows the system's family.** A window takes its family from
  `ctx.fonts` and loads each strike through it. A suitcase whose family the
  system doesn't serve opens the viewer's alert, which says so. The windows,
  the Size menu, Copy, Select All, the zoom box and the alert stay as they
  are.
- **The dev desktop endows its system** as a site does: a System Folder with
  Fonts, and four families borrowed from SystemOnline in `dev/fonts/`, as
  `dev/art/` borrows its art. Chicago has one strike and a measured pitch,
  Geneva seven strikes, Symbol a row beyond Latin, and Espy Sans sizes in
  pixels. It seeds a suitcase of each in Fonts, a second Geneva on the
  desktop, and one of a family it doesn't serve, for the alert.

### 3.6 SystemOnline after

- It keeps the collection, its pipeline and `docs/FONTS.md`, and gives its
  system every family in `CHARSET_FAMILIES`, each strike with its URL under
  `public/fonts/imported/` and its bytes.
- It names the Fonts folder, and its defaults put the suitcases there.
  `FONTS_FOLDER` and the `font` kind in `src/state/kinds.ts` give way to the
  SDK's.
- A desktop from before is given System Folder → Fonts once, as
  `giveSystemFolder()` gave it the System Folder. Each suitcase in Macintosh
  HD → Fonts moves in under its own id, so an open window and any alias of
  it follow, and the old folder, once empty, goes to the Trash. A backup
  from before restores the same way.
- It builds the Font Viewer in from `apps/Font Viewer.png`, and
  `src/apps/font-viewer/` goes.

## 4. Steps

Each step is one repo's, in order.

1. **The SDK** (`system-fonts.md`): the Fonts folder, the `font` kind,
   `opens`, the site's fonts and `ctx.fonts`, in a minor release. As I read
   APP-FILES.md § The app API these are additions, so `APP_API` stays 3;
   the SDK judges.
2. **This repo** moves onto that release (§5), as the Font Viewer's next
   minor, 0.2.0.
3. **SystemOnline** moves onto it and takes the file
   (`font-viewer-app-file.md`) in one change: its built-in viewer registers
   the `font` kind the shell then owns, so the two land together.

Meanwhile this repo keeps the collection, so its dev desktop and its gates
run. Its app file isn't for SystemOnline: built now, it carries the
collection. A commit that tracks `src/strikes/` before step 2 keeps Apple's
strikes in this repo's history after they leave.

## 5. Step 2, here

- `package.json`: `system-online-sdk` to the release's range,
  `vintage-frames` to its peer range; the `charset-manifest` script goes.
  `src/app.ts`: version 0.2.0, and the description's "the classic Macintosh
  bitmap strikes it carries" names the system's.
- `src/index.ts`: no `kinds`; it opens `font`; a window's family comes from
  `ctx.fonts`; the alert says the system lacks the family. Without
  `ctx.fonts`, on a page older than step 1, it opens nothing, and such a
  page lists no suitcase anyway.
- `src/windows.ts`: each strike loads through `ctx.fonts`, and one that
  doesn't says so by its name, "Geneva 9 didn’t load.", in place of its
  file's.
- `src/specimen.ts` and `test/specimen.test.mjs`: the SDK's family and
  strike types in place of the manifest's.
- Gone: `src/strikes/`, `src/strikes.ts`, `src/charset-manifest.ts`,
  `src/suitcase.ts`, `src/art/suitcase.png`, `fonts/`, `docs/FONTS.md`, and
  `__pycache__/` in `.gitignore`.
- `dev/`: the System Folder with Fonts, its art borrowed from SystemOnline,
  `dev/fonts/` and the seed of §3.5.
- CLAUDE.md: the strikes' rule goes; the kind's says it's the system's and
  the Font Viewer opens it; "Two kinds of type" keeps the distinction and
  points at SystemOnline for the collection; `charset-manifest` leaves the
  commands and the build outputs. README: the opening, the dev desktop, the
  scripts and the layout. `docs/asks.md` strikes the SDK's entry.
- Build, read the file back (its manifest, `api` and code size), and check
  by eye (§8). SystemOnline copies the file in at step 3.

## 6. Decisions

1. **Fonts are the system's**, not the viewer's. Ruled 2026-10-11, quoted
   above.
2. **A Fonts folder in the System Folder** decides what's installed, kept
   like Apple Menu Items and Startup Items. Taken with the pattern.
3. **Phase 1 by reference**: a suitcase names a family the site serves.
   A font file format waits for storage beside an item. Taken with the
   pattern.
4. **Existing desktops** get System Folder → Fonts once, at their first boot
   after step 3. Taken with the pattern.
5. **The `font` kind keeps its name and data** and becomes the shell's, so
   nothing saved strands. It's the one kind named for no application, which
   the SDK owns as it owns `app` and `alias`.
6. **An application says what it opens** (`opens`) rather than owning the
   kind, and the first that says so opens it.
7. **No Fonts folder, every family installed**: a site that gives fonts
   without naming the folder has them all.
8. **The SDK ships no fonts**, as it ships no art. A site serves its own,
   and they load on demand.
9. **The dev desktop borrows four families**, not the collection or a path
   into a sibling checkout: CI typechecks `dev/` with no sibling beside it,
   and four families cover what the viewer does.
10. **The emptied old Fonts folder goes to the Trash** rather than standing
    in Macintosh HD beside the real one. SystemOnline's call; the
    alternative leaves it.
11. **`app-file-assets.md` is withdrawn.** Its one case was the strikes. An
    application with content of its own can ask again.
12. **vintage-frames is asked nothing.** It sets text in any registered face
    already.

## 7. Follow-ups

- **The Text Viewer's Font menu**, SystemOnline's, from `ctx.fonts`: the
  first application to set its own text in the system's fonts.
- **Fonts a visitor brings**, once the App Store's runtime installs give an
  item a file of its own: a font file format, a suitcase that carries its
  strikes, and installing one by dropping it in Fonts.
- **A suitcase dropped on the System Folder** filed into Fonts, as System
  7.1's Finder offered. The SDK's, if wanted.
- **The art**: the Fonts folder, a suitcase and the viewer's icon, each a
  stand-in until drawn.

## 8. Eye checks

On this repo's dev desktop after step 2, at 1× and 2×:

1. System Folder → Fonts holds the four suitcases and the unserved one, and
   the second Geneva is on the desktop.
2. Each served suitcase opens its window out of its icon: the sample in
   every strike, the rows in the strike nearest 12. The Geneva on the
   desktop opens the same.
3. Size switches the strike, and Espy Sans' reads in pixels. Select All and
   ⌘C copy. Close, Quit, Arrange Windows and the zoom box work.
4. The unserved suitcase opens the viewer's alert, saying the system lacks
   the family.
5. Empty Trash with Geneva in it reads 27K.
6. `npm run build`: the code is the viewer alone, tens of KB, and imports
   only the three entries.

On SystemOnline after step 3: its request's checks.
