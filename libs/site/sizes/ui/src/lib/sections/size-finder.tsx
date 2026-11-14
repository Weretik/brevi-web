'use client';

import { useState } from 'react';

import { SizeField } from './size-field';
import { SizeToggleGroup } from './size-toggle-group';
import { sizeFinderAnswers } from '../data/size-answers';

import type { SizeFinderInput, SizeKind } from '../data/size-answers';
import type { SizesDictionary } from '../i18n/sizes-dictionary';

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
  const [input, setInput] = useState<SizeFinderInput>({
    kind: initialKind,
    gender: 'men',
    chest: '',
    height: '',
    foot: '',
  });
  const change = (next: Partial<SizeFinderInput>) => setInput((value) => ({ ...value, ...next }));
  const { kind, gender, chest, height, foot } = input;
  const { result } = dictionary;

  const { outputs, outOfRange } = sizeFinderAnswers(input, result);

  return (
    <div className="grid gap-5 rounded-2xl border border-border p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <SizeToggleGroup
          label={dictionary.tabs.label}
          value={kind}
          onChange={(kind) => change({ kind })}
          options={[
            { value: 'clothing', label: dictionary.tabs.clothing },
            { value: 'shoes', label: dictionary.tabs.shoes },
          ]}
        />
        {kind === 'clothing' ? (
          <SizeToggleGroup
            label={dictionary.gender.label}
            value={gender}
            onChange={(gender) => change({ gender })}
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
            <SizeField
              label={dictionary.chest}
              value={chest}
              onChange={(chest) => change({ chest })}
            />
            <SizeField
              label={dictionary.height}
              value={height}
              onChange={(height) => change({ height })}
            />
          </>
        ) : (
          <SizeField label={dictionary.foot} value={foot} onChange={(foot) => change({ foot })} />
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
