import { parsePpeSupplierPrice } from '../../validators/ppe-card/ppe-supplier-offer-validation';

import type { CreateCatalogProductInput } from '../../entities/product-create/product-create';

/** Fields of the page «Новий ЗІЗ», in the order of the sheet instruction for the tab «ЗІЗ». */
export interface PpeCreateFormValues {
  name: string;
  code: string;
  sectionId: number | '';
  unit: string;
  currentSiteUrl: string;
  supplierId: number | '';
  supplierSku: string;
  supplierUrl: string;
  supplierPrice: string;
  ruleCode: string;
  allowManualPrice: boolean;
  isActive: boolean;
}

export type PpeCreateField = keyof PpeCreateFormValues;
export type PpeCreateFieldErrors = Partial<Record<PpeCreateField, string>>;

export const ppeCreateFormDefaults: PpeCreateFormValues = {
  name: '',
  code: '',
  sectionId: '',
  unit: '',
  currentSiteUrl: '',
  supplierId: '',
  supplierSku: '',
  supplierUrl: '',
  supplierPrice: '',
  ruleCode: '',
  allowManualPrice: false,
  isActive: true,
};

/** Units the sheet uses most; the field still takes any text. */
export const ppeUnitSuggestions: readonly string[] = ['пара', 'шт', 'комплект'];

/** Body of `POST /api/v1/products/overview` for a PPE product; call it only for valid values. */
export function ppeCreateBody(values: PpeCreateFormValues): CreateCatalogProductInput {
  return {
    type: 'Ppe',
    code: values.code.trim(),
    name: values.name.trim(),
    sectionId: values.sectionId === '' ? 0 : values.sectionId,
    season: null,
    isActive: values.isActive,
    currentSiteUrl: values.currentSiteUrl.trim() || null,
    quoteDescription: null,
    ppe: {
      supplierId: values.supplierId === '' ? 0 : values.supplierId,
      supplierSku: values.supplierSku.trim() || null,
      supplierUrl: values.supplierUrl.trim(),
      supplierPrice: parsePpeSupplierPrice(values.supplierPrice) ?? 0,
      allowManualPrice: values.allowManualPrice,
      ruleCode: values.ruleCode,
      unit: values.unit.trim(),
    },
  };
}

const serverFields: Record<string, PpeCreateField> = {
  name: 'name',
  code: 'code',
  sectionid: 'sectionId',
  currentsiteurl: 'currentSiteUrl',
  isactive: 'isActive',
  supplierid: 'supplierId',
  suppliersku: 'supplierSku',
  supplierurl: 'supplierUrl',
  supplierprice: 'supplierPrice',
  rulecode: 'ruleCode',
  allowmanualprice: 'allowManualPrice',
  unit: 'unit',
};

/**
 * Server field errors (`Code`, `SectionId`, `Ppe.SupplierId`, …) on the form fields; errors of
 * unknown fields are left out, so the page shows the general message for them.
 */
export function ppeCreateServerErrors(fieldErrors: Record<string, string>): PpeCreateFieldErrors {
  const errors: PpeCreateFieldErrors = {};
  for (const [identifier, message] of Object.entries(fieldErrors)) {
    const key = identifier
      .replace(/^ppe\./i, '')
      .replace(/^request\./i, '')
      .toLowerCase();
    const field = serverFields[key];
    if (field) errors[field] ??= message;
  }
  return errors;
}
