import { formatMeters } from './format-production';
import { itemApplicationKindLabels } from '../entities/orders/production-order';

import type {
  ItemApplication,
  ProductionEmbroideryChoice,
} from '../entities/orders/production-order';

const count = new Intl.NumberFormat('uk-UA');

/** «Вишивка, ВШ-0042, Спина, Логотип, Помаранчевий». */
export const applicationText = (x: ItemApplication) =>
  [itemApplicationKindLabels[x.kind], x.embroideryNumber, x.place, x.description, x.color]
    .filter(Boolean)
    .join(', ');

/** «120 шт · 8 000 стібків на 1 шт · пʼяльця 18». */
export const embroideryChoiceText = (x: ProductionEmbroideryChoice) =>
  `${count.format(x.quantity)} шт · ${count.format(x.stitchesPerUnit)} стібків на 1 шт · пʼяльця ${x.hoopLabel}`;

/** What the workshop cuts for the linked calculation; materials are shown, not taken from stock. */
export function embroideryMaterialsText(x: NonNullable<ItemApplication['embroidery']>) {
  return [
    `${count.format(x.hoopings)} запʼялювань`,
    x.stabilizerMetres === null ? null : `флізелін ${formatMeters(x.stabilizerMetres)}`,
    x.fabricMetres === null ? null : `тканина ${formatMeters(x.fabricMetres)}`,
  ]
    .filter(Boolean)
    .join(' · ');
}

/** The saved calculation in «Ціна вишивки › Збережені». */
export const embroideryCalculationHref = (id: number) =>
  `/crm/embroidery?tab=saved&calculation=${id}`;
