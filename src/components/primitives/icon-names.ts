/** Names of the UI line icons rendered by Icon.astro. Kept in a plain module so
 *  it can be imported by both Icon.astro and the sections that reference icons
 *  by name (esbuild won't re-export a type out of a .astro frontmatter). */
export type IconName =
  | 'users' | 'dataflow' | 'user' | 'plus' | 'chevron-down' | 'check'
  | 'edit' | 'flip-backward' | 'flip-forward' | 'share' | 'settings'
  | 'search' | 'bell' | 'info-square' | 'cursor' | 'perspective'
  | 'keyboard' | 'cube' | 'arrow-up-right' | 'eraser' | 'pencil'
  | 'message' | 'grid' | 'git-branch' | 'star' | 'quote' | 'linkedin'
  | 'arrow-right';
