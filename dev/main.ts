// The dev desktop: the SDK's shell over index.html's desktop, with the SDK's
// Finder and the Font Viewer from its source. The Finder's art is
// SystemOnline's, borrowed (dev/art/), and so are its system's fonts
// (dev/fonts.ts).
//
// The seed installs the fonts as a site does: a suitcase of each family in
// System Folder → Fonts. A second Geneva sits on the desktop, a suitcase
// that opens wherever it is, and a Monaco in Fonts names a family the system
// doesn't serve, for the Font Viewer's alert.
//
// The catalog is in memory and there is no session, so a reload starts over.
// ?save=1 keeps the catalog in IndexedDB and the session in localStorage, so
// the icons' places and the open windows outlast a reload.

import 'vintage-frames'
import { applyCursor } from 'vintage-frames'
import type { VfDesktop } from 'vintage-frames'
import { FONTS, FONT_KIND, createShell, finder, indexedDbStorage, localStorageState, memoryStorage } from 'system-online-sdk'
import { fontViewer } from '../src/index.ts'
import { DEV_FONTS } from './fonts.ts'
import folderArt from './art/folder.png'
import trashArt from './art/trash.png'
import trashFullArt from './art/trash-full.png'
import trashMarkArt from './art/trash-indicator.png'
import documentArt from './art/text-file.png'
import cautionArt from './art/alert.png'
import systemFolderArt from './art/system-folder.png'
import appleMenuItemsArt from './art/apple-menu-items.png'
import startupItemsArt from './art/startup-items.png'
import suitcaseArt from './art/suitcase.png'

const save = new URLSearchParams(location.search).get('save') === '1'
const desktop = document.getElementById('desktop') as VfDesktop

const removeCursor = applyCursor()

const shell = createShell(desktop, {
  apps: [
    finder({
      storage: save ? indexedDbStorage('font-viewer-app') : memoryStorage(),
      art: {
        folder: folderArt,
        trash: trashArt,
        trashFull: trashFullArt,
        trashMark: trashMarkArt,
        document: documentArt,
        caution: cautionArt,
        systemFolder: systemFolderArt,
        appleMenuItems: appleMenuItemsArt,
        startupItems: startupItemsArt,
        suitcase: suitcaseArt,
      },
      volumes: { disk: 'Macintosh HD', trash: 'Trash' },
      system: { folder: 'System Folder', appleMenu: 'Apple Menu Items', startup: 'Startup Items', fonts: 'Fonts' },
      // The times step by a millisecond, so Fonts lists the families in order.
      seed: async (catalog) => {
        let at = Date.now()
        for (const family of [...DEV_FONTS.map((f) => f.name), 'Monaco']) {
          await catalog.create({ kind: FONT_KIND, name: family, parent: FONTS, data: { family }, at: at++ })
        }
        await catalog.create({ kind: FONT_KIND, name: 'Geneva', parent: null, data: { family: 'Geneva' }, at: at++ })
      },
    }),
    fontViewer(),
  ],
  fonts: DEV_FONTS,
  fit: 'viewport',
  state: save ? localStorageState('font-viewer-app:desktop') : null,
})

// HMR teardown. Vite re-runs this module without unloading the old instance,
// so everything wired above is disposed.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    shell.dispose()
    removeCursor()
  })
}
