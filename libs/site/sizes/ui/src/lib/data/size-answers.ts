import { findClothingSize, findHeightGroup, findShoeSize, formatFoot, range } from './size-chart';

import type { Gender } from './size-chart';
import type { SizesDictionary } from '../i18n/sizes-dictionary';

export type SizeKind = 'clothing' | 'shoes';

/** What the visitor typed into the size finder, as text. */
export type SizeFinderInput = {
  kind: SizeKind;
  gender: Gender;
  chest: string;
  height: string;
  foot: string;
};

/** `"95,5"` and `"95.5"` both parse; an empty or non-positive field gives `null`. */
export function parseCm(value: string): number | null {
  const number = Number(value.replace(',', '.'));
  return value.trim() !== '' && Number.isFinite(number) && number > 0 ? number : null;
}

/** The sizes found for the typed measures, and whether any measure is outside the chart. */
export function sizeFinderAnswers(
  input: SizeFinderInput,
  result: SizesDictionary['finder']['result'],
): { outputs: { label: string; value: string }[]; outOfRange: boolean } {
  const outputs: { label: string; value: string }[] = [];
  let outOfRange = false;
  if (input.kind === 'clothing') {
    const chest = parseCm(input.chest);
    const height = parseCm(input.height);
    if (chest !== null) {
      const row = findClothingSize(input.gender, chest);
      if (row) outputs.push({ label: result.size, value: row.size });
      else outOfRange = true;
    }
    if (height !== null) {
      const row = findHeightGroup(input.gender, height);
      if (row)
        outputs.push({ label: result.height, value: `${row.group} (${range(row.height)} см)` });
      else outOfRange = true;
    }
  } else {
    const foot = parseCm(input.foot);
    if (foot !== null) {
      const row = findShoeSize(foot);
      if (row)
        outputs.push({ label: result.shoe, value: `${row.size} (${formatFoot(row.foot)} см)` });
      else outOfRange = true;
    }
  }
  return { outputs, outOfRange };
}
