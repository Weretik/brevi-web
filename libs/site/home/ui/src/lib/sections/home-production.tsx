import type { HomeDictionary } from '../i18n/home-dictionary';

/** Facts about the company's own production, from the live site's home page. */
export function HomeProduction({ points }: { points: HomeDictionary['production']['points'] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {points.map((point) => (
        <li key={point.title} className="bg-background p-5">
          <strong className="block font-extrabold">{point.title}</strong>
          <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
            {point.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
