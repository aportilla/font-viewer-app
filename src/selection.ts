// The selection Edit's Copy and Select All act on. From SystemOnline's
// src/apps/windows.ts, where its viewers shared them.

import type { WindowManager } from 'system-online-sdk'

/** The selected text when the selection is anchored in one of `app`'s
 *  windows, otherwise ''. */
export function selectedTextIn(windows: WindowManager, app: string): string {
  const sel = document.getSelection()
  const at = sel?.anchorNode ?? null
  const el = at instanceof Element ? at : (at?.parentElement ?? null)
  if (!sel || sel.isCollapsed || windows.appOf(el?.closest('vf-window') ?? null) !== app) return ''
  return sel.toString()
}

/** Select everything in `node`. */
export function selectContents(node: Node | null): void {
  const sel = document.getSelection()
  if (!node || !sel) return
  const range = document.createRange()
  range.selectNodeContents(node)
  sel.removeAllRanges()
  sel.addRange(range)
}
