// The Font Viewer as its app file names it. The manifest's id, name, version,
// author and description come from here, and index.ts takes its id and name
// from it, so the two can't drift. The id never changes: saved windows name
// it.

export const APP = {
  id: 'font-viewer',
  name: 'Font Viewer',
  version: '0.2.0',
  author: 'Adam Portilla',
  description:
    "Opens font suitcases: a family's sample line in every strike, then every character of one, set in the bitmap strikes the system serves.",
} as const
