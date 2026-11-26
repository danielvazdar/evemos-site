/**
 * A JSON-LD `<script type="application/ld+json">` block for Evemos's own
 * pages: the structured data search engines and AI answer engines read
 * (article, questions, breadcrumbs).
 *
 * ★ THE SITE'S OWN COPY. The organiser pages have the same component in
 * `src/app/(frontend)/_components/JsonLd.tsx`, and the two route groups may not
 * import each other (`src/admin/admin-styles.test.ts`). Fold both into one
 * shared module when someone owns `src/lib` and the event pages at once.
 *
 * `JSON.stringify` escapes for JSON, not for HTML: a `</script>` inside a
 * string would close the tag early. `<` is still valid JSON and reads back
 * as `<`. U+2028/U+2029 end a line in JavaScript, so they are escaped too.
 * A JSON-LD block is data, never run, so the page's CSP nonce does not apply.
 */
interface JsonLdProps {
  data: Readonly<Record<string, unknown>>
}

export const escapeForScriptTag = (json: string): string =>
  json.replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeForScriptTag(JSON.stringify(data)) }} />
}
