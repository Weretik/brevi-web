export type JsonLdData = Record<string, unknown>;

/** Serializes JSON-LD so that `</script>` and HTML comments inside values cannot break out of the tag. */
export function serializeJsonLd(data: JsonLdData | JsonLdData[]): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/** Renders structured data in the server HTML. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
