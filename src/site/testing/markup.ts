/**
 * Helpers for the site's render tests, which read the markup `renderToStaticMarkup` returns. Test code only.
 */

/** The markup without its `aria-hidden` subtrees, nested tags counted: what is left is what a screen reader meets. */
export const withoutHidden = (markup: string): string => {
  const hidden = /<(\w+)\b[^>]*\baria-hidden="true"[^>]*>/.exec(markup)
  if (!hidden) return markup
  const after = hidden.index + hidden[0].length
  if (hidden[0].endsWith('/>')) return markup.slice(0, hidden.index) + withoutHidden(markup.slice(after))
  const tags = new RegExp(`<(/?)${hidden[1]}\\b[^>]*>`, 'g')
  tags.lastIndex = after
  let depth = 1
  while (depth > 0) {
    const tag = tags.exec(markup)
    if (!tag) throw new Error(`unclosed <${hidden[1]}>`)
    if (tag[1]) depth -= 1
    else if (!tag[0].endsWith('/>')) depth += 1
  }
  return markup.slice(0, hidden.index) + withoutHidden(markup.slice(tags.lastIndex))
}
