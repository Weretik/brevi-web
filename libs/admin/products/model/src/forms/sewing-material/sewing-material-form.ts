import { materialUnitForKind } from '../../queries/sewing-composition/sewing-material-defaults';
import { parseSewingMetres } from '../sewing-variant/sewing-variant-form';

import type {
  SewingMaterialDraft,
  SewingMaterialKind,
  SewingMaterialUnit,
} from '../../entities/sewing-composition';

/** Side panel «Матеріал» of the shared composition («Комплектація»). */
export interface SewingMaterialFormValues {
  kind: SewingMaterialKind;
  referenceId: number | null;
  costCode: string;
  quantity: string;
  unit: SewingMaterialUnit;
  comment: string;
}

export type SewingMaterialField = keyof SewingMaterialFormValues;
export type SewingMaterialFieldErrors = Partial<Record<SewingMaterialField, string>>;

const decimal = (value: number) => String(value).replace('.', ',');

export function createSewingMaterialFormValues(
  material: SewingMaterialDraft | null,
): SewingMaterialFormValues {
  if (!material)
    return {
      kind: 'Accessory',
      referenceId: null,
      costCode: '',
      quantity: '1',
      unit: 'Piece',
      comment: '',
    };
  return {
    kind: material.kind,
    referenceId: material.referenceId,
    costCode: material.costCode ?? '',
    quantity: decimal(material.quantity),
    unit: material.unit,
    comment: material.comment,
  };
}

/** A new kind resets the reference and takes its default unit. */
export function changeSewingMaterialKind(
  values: SewingMaterialFormValues,
  kind: SewingMaterialKind,
): SewingMaterialFormValues {
  return { ...values, kind, referenceId: null, costCode: '', unit: materialUnitForKind(kind) };
}

export function sewingMaterialFromForm(
  values: SewingMaterialFormValues,
  clientId: string,
  sortOrder: number,
): SewingMaterialDraft {
  return {
    clientId,
    kind: values.kind,
    referenceId: values.kind === 'OtherCost' ? null : values.referenceId,
    costCode: values.kind === 'OtherCost' ? values.costCode.trim() : null,
    quantity: parseSewingMetres(values.quantity),
    unit: values.unit,
    sortOrder,
    comment: values.comment.trim(),
  };
}

export function validateSewingMaterialForm(
  values: SewingMaterialFormValues,
): SewingMaterialFieldErrors {
  const errors: SewingMaterialFieldErrors = {};
  const quantity = parseSewingMetres(values.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) errors.quantity = 'Вкажіть кількість більше 0.';
  else if (Math.round(quantity * 1e6) / 1e6 !== quantity)
    errors.quantity = 'Не більше шести знаків після коми.';
  if (values.kind === 'OtherCost') {
    if (!values.costCode.trim()) errors.costCode = 'Вкажіть код витрати.';
    else if (values.costCode.trim().length > 80) errors.costCode = 'Не більше 80 символів.';
  } else if (!values.referenceId) {
    errors.referenceId = values.kind === 'Fabric' ? 'Оберіть тканину.' : 'Оберіть фурнітуру.';
  }
  if (values.comment.trim().length > 500) errors.comment = 'Коментар — до 500 символів.';
  return errors;
}
