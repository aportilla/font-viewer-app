// Font Viewer: opens font suitcases, the shell's `font` kind, one window each,
// set in the family's strikes, which the system serves and loads (ctx.fonts,
// windows.ts), and fills the Size menu with the active window's. It opens on
// the strike nearest 12; the zoom box, which the window manager runs, toggles
// a wide column (layout.ts). A suitcase opens wherever it is, installed or
// not; one whose family the system doesn't serve says so when opened.

import { VfWindow } from 'vintage-frames'
import type { VfViewportBox } from 'vintage-frames'
import { FONT_KIND, defineApp, fontFamilyOf } from 'system-online-sdk'
import type { AppDefinition, Item } from 'system-online-sdk'
import menus from './menus.html?raw'
import dialogs from './dialogs.html?raw'
import windowMarkup from './windows.html?raw'
// Its icon is a stand-in until drawn: System 7's generic application icon.
import icon from './art/font-viewer.png'
import alertArt from './art/alert.png'
import { APP } from './app.ts'
import { ask } from './alert.ts'
import { selectContents, selectedTextIn } from './selection.ts'
import { fontWindow, render, specimenOf } from './windows.ts'
import type { Specimen } from './windows.ts'
import { expandedFontBox } from './layout.ts'
import { OPENING_SIZE, nearestStrike, sizeLabel } from './specimen.ts'

export const FONT_VIEWER = APP.id

export interface FontViewerActions {
  /** Open a suitcase's window, or bring it forward. The shell opens a
   *  suitcase through it, and the boot reopens the last session's windows. */
  open(target: { item?: string | null; from?: VfViewportBox | null }): void
}

export function fontViewer(): AppDefinition<FontViewerActions> {
  return defineApp<FontViewerActions>({
    id: FONT_VIEWER,
    name: APP.name,
    icon,
    menus,
    dialogs,
    windows: windowMarkup,
    opens: [FONT_KIND],
    init(ctx) {
      const { desktop, windows } = ctx
      const sizeMenu = ctx.menu('size')
      const alert = ctx.dialog('alert')
      // The alert's art is the Font Viewer's own, set here: a ?raw fragment
      // can't name an imported file.
      alert.querySelector('img')!.src = alertArt
      /** Each open window's family and strike. */
      const specimens = new WeakMap<VfWindow, Specimen>()
      /** The active window's, when it is a font window. */
      const active = (): Specimen | null => {
        const w = desktop.activeWindow
        return w instanceof VfWindow ? (specimens.get(w) ?? null) : null
      }

      /** The Size menu: the active window's strikes, its own checked. The menu
       *  is on the bar only while a font window is active. */
      const syncSize = () => {
        const s = active()
        if (!s) return
        const { family, strike } = s
        const shows = `${family.name} ${family.strikes.map((f) => `${f.size}:${f === strike}`).join(' ')}`
        if (sizeMenu.dataset.shows === shows) return
        sizeMenu.dataset.shows = shows
        sizeMenu.replaceChildren(
          ...family.strikes.map((f) => {
            const item = document.createElement('vf-menu-item')
            item.value = String(f.size)
            item.textContent = sizeLabel(family, f)
            item.checked = f === strike
            return item
          })
        )
      }
      ctx.on(desktop, 'vf-activate', syncSize)

      /** Opens a suitcase's window out of `from`. */
      const openFont = (item: Item, from: VfViewportBox | null) => {
        const name = fontFamilyOf(item) ?? item.name
        const family = ctx.fonts.family(name)
        const strike = family ? nearestStrike(family, OPENING_SIZE) : null
        if (!family || !strike) {
          void ask(ctx, alert, `“${item.name}” can’t be opened: the system doesn’t have the ${name} font.`)
          return
        }
        windows.open({
          app: FONT_VIEWER,
          item: item.id,
          from,
          create: () => {
            const s: Specimen = { win: fontWindow(ctx.window('font'), item.name), family, strike, pass: 0 }
            specimens.set(s.win, s)
            void render(s, ctx.fonts)
            return s.win
          },
          zoom: expandedFontBox,
        })
        syncSize()
      }

      ctx.onMenu((value, item) => {
        const s = active()
        if (sizeMenu.contains(item)) {
          const strike = s?.family.strikes.find((f) => String(f.size) === value)
          if (!s || !strike || strike === s.strike) return
          s.strike = strike
          void render(s, ctx.fonts)
          syncSize()
        } else if (value === 'close' && s) void windows.requestClose(s.win)
        else if (value === 'quit') void windows.closeAll(FONT_VIEWER)
        // The enabled item takes ⌘C, so the browser's own copy does not run.
        else if (value === 'copy') navigator.clipboard?.writeText?.(selectedTextIn(windows, FONT_VIEWER)).catch(() => {})
        else if (value === 'select-all' && s) selectContents(specimenOf(s.win))
        else if (value === 'arrange') windows.arrange()
      })
      // Copy is disabled unless a font window holds a selection.
      ctx.gate(ctx.item('copy'), () => selectedTextIn(windows, FONT_VIEWER) !== '')
      ctx.gate(ctx.item('arrange'), () => !windows.arranged())

      return {
        open({ item, from = null }) {
          const it = ctx.catalog?.item(item)
          // A page older than the system's fonts has no ctx.fonts, and lists
          // no suitcase.
          if (it?.kind === FONT_KIND && ctx.fonts) openFont(it, from)
        },
      }
    },
  })
}

/** The app file's code exports its factory by default. */
export default fontViewer
