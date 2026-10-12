// Font Viewer windows: one per open suitcase, a copy of windows.html's. The body
// sets the sample line in every strike of the family, then every character of
// the chosen strike, each in the strike itself, which the system loads
// (ctx.fonts): the paragraph carries the strike's family, its rect as the size
// (one design px per system px) and its measured pitch as the line height, so
// nothing on it can be another font's fallback.

import { VfParagraph } from 'vintage-frames'
import type { VfLabel, VfWindow } from 'vintage-frames'
import type { FontFamily, FontStrike, SystemFonts } from 'system-online-sdk'
import { SAMPLE, charsetRows, strikeName } from './specimen.ts'

/** An open suitcase's window, its family and the strike it shows. */
export interface Specimen {
  win: VfWindow
  family: FontFamily
  strike: FontStrike
  /** Bumped by each render, so a load that finishes late draws nothing. */
  pass: number
}

/** `win`, a fresh font window, titled `name` and not yet drawn. */
export function fontWindow(win: VfWindow, name: string): VfWindow {
  win.heading = name
  return win
}

/** A window's body, whose contents Select All selects. */
export const specimenOf = (win: VfWindow) => win.querySelector('.font-specimen')

/** A paragraph set in `strike`, loaded as the font-family `face`, or saying it
 *  didn't load (null). */
function strikeParagraph(family: FontFamily, strike: FontStrike, text: string, face: string | null) {
  const p = new VfParagraph()
  p.setAttribute('fill-width', '')
  if (!face) {
    p.textContent = `${strikeName(family, strike)} didn’t load.`
    return p
  }
  p.style.setProperty('--vf-font-family', face)
  p.style.setProperty('--vf-font-size', `${strike.line}px`)
  p.style.setProperty('--vf-paragraph-line-height', `${strike.pitch}px`)
  p.textContent = text
  return p
}

/** Draws a window's samples, character rows and status. Every strike loads
 *  first; the wristwatch shows while one is loading. One that failed is tried
 *  again at the next render. */
export async function render(s: Specimen, fonts: SystemFonts): Promise<void> {
  const pass = ++s.pass
  const { win, family, strike } = s
  win.setAttribute('aria-busy', 'true')
  const faces = await Promise.all(family.strikes.map((f) => fonts.load(family.name, f.size)))
  if (pass !== s.pass) return
  win.removeAttribute('aria-busy')
  const samples = win.querySelector('.font-samples') as HTMLElement
  samples.replaceChildren(...family.strikes.map((f, i) => strikeParagraph(family, f, SAMPLE, faces[i] ?? null)))
  const face = faces[family.strikes.indexOf(strike)] ?? null
  const charset = win.querySelector('.font-charset') as HTMLElement
  charset.replaceChildren(...(face ? charsetRows(strike.chars) : ['']).map((row) => strikeParagraph(family, strike, row, face)))
  const status = win.querySelector('.font-status') as VfLabel
  status.textContent = `${strikeName(family, strike)} · ${[...strike.chars].length} characters`
}
