/** Links to the blocks of the product page under the first screen; the page lists only the blocks it has. */
export function CatalogProductNav({
  label,
  items,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-border text-[0.9375rem] font-bold">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block px-3.5 py-3 text-muted-foreground transition-colors hover:text-foreground hover:shadow-[inset_0_-2px_0_var(--color-brand)] focus-visible:text-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
