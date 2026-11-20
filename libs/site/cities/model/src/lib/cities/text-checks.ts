/** Sentences of a text in a comparable form: lower case, single spaces, without the final mark. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) =>
      sentence
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[.!?]+$/, '')
        .trim(),
    )
    .filter((sentence) => sentence.length > 0);
}

/**
 * Sentences that appear on more than one page, each page given as its blocks of text. City pages must
 * not share sentences, or search engines see them as one page with the city swapped.
 */
export function repeatedSentences(pages: readonly (readonly string[])[]): string[] {
  const seen = new Map<string, number>();
  pages.forEach((blocks, page) => {
    for (const sentence of new Set(blocks.flatMap(sentences))) {
      const first = seen.get(sentence);
      seen.set(sentence, first === undefined ? page : first === page ? page : -1);
    }
  });
  return [...seen].filter(([, page]) => page === -1).map(([sentence]) => sentence);
}
