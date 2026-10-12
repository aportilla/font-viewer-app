import { test } from 'node:test'
import assert from 'node:assert/strict'

import { charsetRows, nearestStrike, sizeLabel, strikeName } from '../src/specimen.ts'

const strike = (size) => ({ size, line: size + 3, pitch: size + 3, url: `/X-${size}.woff2`, bytes: 3000, chars: 'a' })
const geneva = { name: 'Geneva', strikes: [9, 10, 12, 14].map(strike) }
const espy = { name: 'Espy Sans', sizes: 'pixels', strikes: [strike(16)] }

test('rows: ASCII, accented Latin and the rest, empty rows left out', () => {
  assert.deepEqual(charsetRows('Ab1éü⌘π'), ['Ab1', 'éü', '⌘π'])
  assert.deepEqual(charsetRows('abc'), ['abc'])
})

test('nearest strike: the exact size, else the nearest, a tie to the smaller', () => {
  assert.equal(nearestStrike(geneva, 12).size, 12)
  assert.equal(nearestStrike(geneva, 13).size, 12)
  assert.equal(nearestStrike({ ...geneva, strikes: [strike(10), strike(14)] }, 12).size, 10)
  assert.equal(nearestStrike({ ...geneva, strikes: [] }, 12), null)
})

test('names: the strike and the Size item, in points unless the family counts pixels', () => {
  assert.equal(strikeName(geneva, geneva.strikes[0]), 'Geneva 9')
  assert.equal(sizeLabel(geneva, geneva.strikes[0]), '9 Point')
  assert.equal(sizeLabel({ ...geneva, sizes: 'points' }, geneva.strikes[0]), '9 Point')
  assert.equal(sizeLabel(espy, espy.strikes[0]), '16 Pixels')
})
