import { cn } from '@site/shared/ui';

import type { ReturnsGroup } from '../i18n/returns-dictionary';

/**
 * Titled groups of rules as cards. `numbered` shows a mono step number with a dashed seam above each title,
 * for the step-by-step instruction.
 */
export function ReturnsGroups({
  groups,
  numbered = false,
  columns = 3,
}: {
  groups: readonly ReturnsGroup[];
  numbered?: boolean;
  columns?: 2 | 3;
}) {
  return (
    <ol className={cn('grid gap-4', columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>
      {groups.map((group, index) => (
        <li
          key={group.title}
          className="grid content-start gap-3 rounded-xl border border-border p-5"
        >
          {numbered ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
          ) : null}
          <h3 className="text-lg leading-snug font-extrabold">{group.title}</h3>
          {group.intro ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{group.intro}</p>
          ) : null}
          <ul className="grid gap-2.5">
            {group.items.map((item) => (
              <li key={item.text} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="mt-2 size-1.5 flex-none rounded-full bg-brand" />
                <span className="text-muted-foreground">
                  {item.title ? (
                    <strong className="font-bold text-foreground">{item.title}. </strong>
                  ) : null}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
