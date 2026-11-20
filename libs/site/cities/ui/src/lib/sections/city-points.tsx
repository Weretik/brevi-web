import { cn } from '@site/shared/ui';

/**
 * Titled points in cards: the kinds of work of a city, the ways to put a logo on, the steps of an order, or the
 * prices by quantity. `numbered` puts «01», «02»… above each title, for steps.
 */
export function CityPoints({
  items,
  numbered = false,
}: {
  items: readonly { title: string; text: string }[];
  numbered?: boolean;
}) {
  const List = numbered ? 'ol' : 'ul';
  return (
    <List
      className={cn(
        'grid gap-4 sm:grid-cols-2',
        items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      )}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="grid content-start gap-3 rounded-xl border border-border p-5 sm:p-6"
        >
          {numbered ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
          ) : null}
          <h3 className="text-xl leading-snug font-extrabold">{item.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
        </li>
      ))}
    </List>
  );
}
