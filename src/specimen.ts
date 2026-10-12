// Font Viewer text (pure): the sample line, the character rows, a strike's
// names and the strike a window opens on.

import type { FontFamily, FontStrike } from 'system-online-sdk/pure'

/** The sample line System 7 set a font in when a font file was opened. */
export const SAMPLE = 'How razorback-jumping frogs can level six piqued gymnasts!'

/** The size a window opens on, or the strike nearest it. */
export const OPENING_SIZE = 12

/** A strike's name, the one the system registers it under: "Geneva 9". */
export const strikeName = (family: FontFamily, strike: FontStrike): string =>
  `${family.name} ${strike.size}`

/** A Size menu item: "9 Point", or "16 Pixels" where the family's sizes count
 *  pixels, its point sizes unknown. */
export const sizeLabel = (family: FontFamily, strike: FontStrike): string =>
  `${strike.size} ${family.sizes === 'pixels' ? 'Pixels' : 'Point'}`

/** The strike whose size sits nearest `target`; a tie goes to the smaller. */
export function nearestStrike(family: FontFamily, target: number): FontStrike | null {
  let best: FontStrike | null = null
  for (const strike of family.strikes) {
    if (!best || Math.abs(strike.size - target) < Math.abs(best.size - target)) best = strike
  }
  return best
}

/** A strike's characters as the specimen's rows: ASCII, accented Latin, then
 *  the rest. Empty rows are left out. */
export function charsetRows(chars: string): string[] {
  let ascii = ''
  let latin = ''
  let rest = ''
  for (const ch of chars) {
    const cp = ch.codePointAt(0) ?? 0
    if (cp <= 0x7e) ascii += ch
    else if (cp <= 0x24f) latin += ch
    else rest += ch
  }
  return [ascii, latin, rest].filter((row) => row !== '')
}
