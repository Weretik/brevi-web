import type { RequestDictionary } from '../i18n/request-dictionary';

/** One quiet line of terms under the form, so the visitor does not have to leave the page to check them. */
export function RequestFacts({ dictionary }: { dictionary: RequestDictionary }) {
  return (
    <ul
      aria-label={dictionary.factsLabel}
      className="flex flex-wrap gap-x-10 gap-y-3 border-t pt-5 text-[0.9375rem] font-bold"
    >
      {dictionary.facts.map((fact) => (
        <li key={fact}>{fact}</li>
      ))}
    </ul>
  );
}
