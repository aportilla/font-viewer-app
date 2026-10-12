# Font Viewer

The font suitcase viewer for
[SystemOnline](https://github.com/aportilla/system-online), the System 7
desktop in the browser: a suitcase's sample line in every strike of its
family, then every character of one, each set in the strike itself, with a
Size menu of the family's strikes. The fonts are the system's: the site
serves them, a suitcase in System Folder → Fonts installs its family, and
the Font Viewer shows any suitcase's family the system has. Use it at
<https://system-online.portill.io/>: open a suitcase.

The Font Viewer is built on the published
[**system-online-sdk**](https://www.npmjs.com/package/system-online-sdk) and
[**vintage-frames**](https://www.npmjs.com/package/vintage-frames): the SDK's
shell runs it over the kit's elements, and hands it the system's fonts
through `ctx.fonts`. Its release is its app file, `Font Viewer.png`: a PNG
whose picture is the Font Viewer's box and whose chunks carry its manifest,
its icon and its code. SystemOnline keeps app files in its `apps/` and
builds them in, so a release is that file copied over. Nothing is published
to npm.

```sh
npm install
npm run dev        # http://localhost:5173/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | the dev desktop: the SDK's Finder with a System Folder holding Fonts, four families served to its system, and the Font Viewer from its source |
| `npm run build` | the app file, `dist/Font Viewer.png`: the Font Viewer's box, with its manifest and code in the PNG's chunks |
| `npm test` | unit tests for the viewer's pure logic (`node --test`) |
| `npm run typecheck` | `tsc` over the viewer, the dev desktop and the Vite config |

The dev desktop endows its system as a site does: four families borrowed
from SystemOnline (`dev/fonts/`), and a suitcase of each in System Folder →
Fonts. A second Geneva sits on the desktop, and a Monaco in Fonts names a
family the system doesn't serve, which the viewer says it can't show. It
starts over at each reload. `?save=1` keeps its catalog in IndexedDB and its
session in localStorage, so the open windows outlast a reload.

The packer, the box and its frame are the SDK's: `vite.config.ts` is one
call to `appFile()` from `system-online-sdk/build`, whose guide is the SDK's
[`docs/APP-FILES.md`](https://github.com/aportilla/system-online-sdk/blob/main/docs/APP-FILES.md).
The box carries the icon's stamp until the Font Viewer has artwork of its
own, and the icon is System 7's generic application icon until it's drawn.

## Two kinds of type, kept apart

The windows' chrome is drawn in `VF Display` and `VF Body`, vintage-frames'
**own re-drawn strikes**, in the style of the faces Susan Kare designed for
Apple's original Macintosh, credited to her and Apple as designers but not
Apple's files. The strikes the viewer shows are the opposite: **genuine
Apple bitmap strikes** under their own names, converted from classic font
suitcases. They're SystemOnline's collection, served by its system; see its
`docs/FONTS.md`. The four families in `dev/fonts/` are borrowed from it.

## Layout

```
index.html, dev/main.ts   the dev desktop
dev/fonts.ts, dev/fonts/  the dev desktop's system fonts: four families borrowed from SystemOnline
dev/art/                  the dev desktop's Finder art, borrowed from SystemOnline
src/app.ts                the Font Viewer's id, name, version, author and description: the manifest's source
src/index.ts              the application: its definition and its factory, the default export
src/windows.html          a font window: the samples, a rule, the character rows, the status strip
src/windows.ts            what a font window holds, each paragraph set in its strike
src/specimen.ts           the sample line, the rows, a strike's names (pure)
src/layout.ts             the zoom box's column (pure)
src/alert.ts              its alert, grown to its message
src/selection.ts          what Copy and Select All act on
src/menus.html            its File, Edit, View and Size menus
src/dialogs.html          its alert
src/art/                  its icon and the alert's
test/                     unit tests
docs/system-fonts-plan.md fonts as the system's, and how the Font Viewer moved onto them
docs/asks.md              what it has asked of its sibling repos
```
