import {
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  nullableNumber,
  nullableText,
  oneOf,
  record,
  text,
} from '../../../validators/production-response';

import type {
  ItemApplication,
  ProductionEmbroidery,
  ProductionEmbroideryChoice,
} from '@admin/production/model';

export function mapProductionEmbroideryChoice(value: unknown): ProductionEmbroideryChoice {
  const row = record(value, 'розрахунок вишивки');
  return {
    id: integer(row['id'], 'id розрахунку вишивки', 1),
    number: nonEmptyText(row['number'], 'номер розрахунку вишивки'),
    name: text(row['name'], 'назва розрахунку вишивки'),
    customerName: nullableText(row['customerName'], 'клієнт розрахунку вишивки'),
    quantity: integer(row['quantity'], 'кількість вишивки', 1),
    stitchesPerUnit: integer(row['stitchesPerUnit'], 'стібки'),
    hoopLabel: text(row['hoopLabel'], 'пʼяльця'),
    mockupThumbnailUrl: nullableText(row['mockupThumbnailUrl'], 'мініатюра макета'),
  };
}

export const mapProductionEmbroideryChoices = (value: unknown) =>
  list(value, 'розрахунки вишивки').map(mapProductionEmbroideryChoice);

function mapEmbroidery(value: unknown): ProductionEmbroidery | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'розрахунок вишивки');
  return {
    ...mapProductionEmbroideryChoice(row),
    mode: oneOf(row['mode'], ['Garment', 'Chevron'] as const, 'вид вишивки'),
    hoopings: integer(row['hoopings'], 'запʼялювання'),
    stabilizerMetres: nullableNumber(row['stabilizerMetres'], 'флізелін'),
    fabricMetres: nullableNumber(row['fabricMetres'], 'тканина вишивки'),
    mockupUrl: nullableText(row['mockupUrl'], 'макет'),
  };
}

export function mapApplication(value: unknown): ItemApplication {
  const row = record(value, 'нанесення');
  return {
    kind: oneOf(row['kind'], ['Embroidery', 'Print'] as const, 'вид нанесення'),
    place: nullableText(row['place'], 'місце нанесення'),
    description: nullableText(row['description'], 'опис нанесення'),
    color: nullableText(row['color'], 'колір нанесення'),
    embroideryCalculationId: nullableInteger(row['embroideryCalculationId'], 'розрахунок вишивки'),
    embroideryNumber: nullableText(row['embroideryNumber'], 'номер розрахунку вишивки'),
    embroidery: mapEmbroidery(row['embroidery']),
  };
}
