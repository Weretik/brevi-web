import type { FabricNormRow } from '../entities/fabric-norm';
import type { ModelComposition, ModelCompositionLine } from '../entities/model-composition';

/** One fabric of a colour variant: «Основна», «Додаткова», «Додаткова 1», «Додаткова 2». */
export interface FabricNormPart {
  label: string;
  meters: number;
}

/** A colour variant of a norm; `parts` is empty when the model is not sewn in this variant. */
export interface FabricNormVariant {
  key: 'one' | 'two' | 'three';
  title: string;
  parts: FabricNormPart[];
  /** The sum of the parts; null for a single fabric or an empty variant. */
  total: number | null;
}

const scale = 1000;
const round = (value: number) => Math.round(value * scale) / scale;

const parts = (entries: [string, number | null | undefined][]): FabricNormPart[] =>
  entries.flatMap(([label, meters]) => (meters == null ? [] : [{ label, meters }]));

const sum = (items: FabricNormPart[]) =>
  items.length > 1 ? round(items.reduce((total, part) => total + part.meters, 0)) : null;

/** The three colour variants of a model's norm, each fabric on its own line. */
export function fabricNormVariants(row: Pick<FabricNormRow, 'norm'>): FabricNormVariant[] {
  const norm = row.norm;
  const one = parts([['Основна', norm?.oneColor]]);
  const two = parts([
    ['Основна', norm?.twoColorsMain],
    ['Додаткова', norm?.twoColorsAdditional],
  ]);
  const three = parts([
    ['Основна', norm?.threeColorsMain],
    ['Додаткова 1', norm?.threeColorsAdditional1],
    ['Додаткова 2', norm?.threeColorsAdditional2],
  ]);
  return [
    { key: 'one', title: '1 колір', parts: one, total: null },
    { key: 'two', title: '2 кольори', parts: two, total: sum(two) },
    { key: 'three', title: '3 кольори', parts: three, total: sum(three) },
  ];
}

/** Lines of the composition besides lining, insulation and fleece (shown separately). */
export function compositionRest(model: Pick<ModelComposition, 'layers' | 'lines'>) {
  const layerCodes = new Set(model.layers.map((layer) => layer.code).filter(Boolean));
  return model.lines.filter(
    (line: ModelCompositionLine) => line.kind !== 'Accessory' || !layerCodes.has(line.code),
  );
}

export const BATCH_SIZE_MAX = 100000;

/** A whole number of items from 1 to 100 000, or null while the field is empty or wrong. */
export function parseBatchSize(value: string): number | null {
  const text = value.trim();
  if (!/^\d+$/.test(text)) return null;
  const size = Number(text);
  return size >= 1 && size <= BATCH_SIZE_MAX ? size : null;
}

/** Quantity for a batch, rounded like the norms. */
export const forBatch = (perItem: number, size: number) => round(perItem * size);
