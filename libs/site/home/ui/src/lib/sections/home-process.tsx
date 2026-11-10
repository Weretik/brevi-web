import type { HomeDictionary } from '../i18n/home-dictionary';

/** Four steps from request to shipment, joined by a dashed seam. */
export function HomeProcess({ steps }: { steps: HomeDictionary['process']['steps'] }) {
  return (
    <ol className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          <div aria-hidden className="mb-3.5 flex items-center gap-2.5">
            <span className="grid size-9 flex-none place-items-center rounded-full border-2 border-primary font-mono font-semibold">
              {index + 1}
            </span>
            <span className="flex-1 border-t-2 border-dashed border-brand-soft" />
          </div>
          <h3 className="mb-1.5 text-[1.0625rem] font-extrabold">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
