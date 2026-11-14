'use client';

import { cn } from '@site/shared/ui';
import { useState } from 'react';

import { sizeFinderAnswers } from '../data/size-answers';

import type { SizeKind } from '../data/size-answers';
import type { Gender } from '../data/size-chart';
import type { SizesDictionary } from '../i18n/sizes-dictionary';

const FIELD =
  'h-11 w-full rounded-lg border border-border-strong bg-muted px-3 font-mono text-base outline-none focus-visible:ring-2 focus-visible:ring-ring';

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'h-9 rounded-md px-4 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            option.value === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {label}
      <input
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD}
      />
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-xl bg-brand-surface px-5 py-4">
      <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
      <span className="font-mono text-2xl font-semibold">{value}</span>
    </div>
  );
}

/**
 * Size finder: chest and height for clothing, foot length for shoes. The answer is text in a polite live
 * region. A value outside the chart points the visitor to a call.
 */
export function SizeFinder({
  dictionary,
  initialKind = 'clothing',
}: {
  dictionary: SizesDictionary['finder'];
  initialKind?: SizeKind;
}) {
  const [kind, setKind] = useState<SizeKind>(initialKind);
  const [gender, setGender] = useState<Gender>('men');
  const [chest, setChest] = useState('');
  const [height, setHeight] = useState('');
  const [foot, setFoot] = useState('');
  const { result } = dictionary;

  const { outputs, outOfRange } = sizeFinderAnswers({ kind, gender, chest, height, foot }, result);

  return (
    <div className="grid gap-5 rounded-2xl border border-border p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label={dictionary.tabs.label}
          value={kind}
          onChange={setKind}
          options={[
            { value: 'clothing', label: dictionary.tabs.clothing },
            { value: 'shoes', label: dictionary.tabs.shoes },
          ]}
        />
        {kind === 'clothing' ? (
          <ToggleGroup
            label={dictionary.gender.label}
            value={gender}
            onChange={setGender}
            options={[
              { value: 'men', label: dictionary.gender.men },
              { value: 'women', label: dictionary.gender.women },
            ]}
          />
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {kind === 'clothing' ? (
          <>
            <Field label={dictionary.chest} value={chest} onChange={setChest} />
            <Field label={dictionary.height} value={height} onChange={setHeight} />
          </>
        ) : (
          <Field label={dictionary.foot} value={foot} onChange={setFoot} />
        )}
      </div>

      <div aria-live="polite" className="grid gap-3 sm:grid-cols-2">
        {outputs.map((output) => (
          <Result key={output.label} {...output} />
        ))}
        {outOfRange ? (
          <p className="rounded-xl bg-muted px-5 py-4 text-sm leading-relaxed sm:col-span-2">
            {result.outOfRange}
          </p>
        ) : null}
        {outputs.length === 0 && !outOfRange ? (
          <p className="text-sm text-muted-foreground sm:col-span-2">{result.empty}</p>
        ) : null}
      </div>
    </div>
  );
}
