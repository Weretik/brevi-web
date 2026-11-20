import type { HomeDictionary } from '../../i18n/home-dictionary';

/** Industries as plain text cards: the owner asked for no links here; the industries page is in the footer. */
export function HomeIndustries({ items }: { items: HomeDictionary['industries']['items'] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.title} className="rounded-xl border border-border px-5 py-4">
          <span className="block font-extrabold">{item.title}</span>
          <span className="text-[0.8125rem] text-muted-foreground">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
