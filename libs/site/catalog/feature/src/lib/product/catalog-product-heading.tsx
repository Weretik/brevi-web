import type { CatalogProductFacts } from '@site/catalog/model';

/**
 * Top of the product card: the tags and the model code, the name, and the lines on who the model is for.
 */
export function CatalogProductHeading({
  facts,
  model,
  name,
  modelLabel,
}: {
  facts: CatalogProductFacts;
  model: string | null;
  name: string;
  modelLabel: string;
}) {
  return (
    <>
      {facts.tags.length > 0 || model ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {facts.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border-strong px-3 py-0.5 font-semibold text-foreground"
            >
              {tag}
            </span>
          ))}
          {model ? (
            <span>
              {modelLabel} <span className="font-mono font-semibold text-foreground">{model}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      <h1 className="text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.25rem]">
        {name}
      </h1>
      {facts.audience || facts.notes.length > 0 ? (
        <div className="grid gap-1.5 leading-relaxed text-muted-foreground">
          {facts.audience ? (
            <p className="line-clamp-3">
              <strong className="text-foreground">{facts.audience.name}:</strong>{' '}
              {facts.audience.value}
            </p>
          ) : null}
          {facts.notes.map((note) => (
            <p key={note} className="text-sm">
              {note}
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
}
