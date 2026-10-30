import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Contract slices required by current Admin consumers, grouped by canonical source. */
const requiredOperations = {
  'identity/session.openapi.yaml': [
    'loginSession',
    'refreshSession',
    'logoutSession',
    'getCurrentSession',
  ],
  'reference/suppliers.openapi.yaml': [
    'getSuppliers',
    'createSupplier',
    'updateSupplier',
    'deleteSupplier',
  ],
  'reference/garment-accessories.openapi.yaml': [
    'getGarmentAccessories',
    'createGarmentAccessory',
    'updateGarmentAccessory',
    'deleteGarmentAccessory',
  ],
  'reference/fabrics.openapi.yaml': ['getFabrics', 'createFabric', 'updateFabric', 'deleteFabric'],
  'reference/additional-references.openapi.yaml': [
    'getAdditionalReferences',
    'updateAdditionalReference',
  ],
  'catalog/product-catalog.openapi.yaml': [
    'getAdminProducts',
    'getAdminProductById',
    'createProduct',
    'replaceProduct',
    'deleteProduct',
  ],
  'catalog/product-dependencies.openapi.yaml': [
    'getAdminProductCategories',
    'getCatalogMedia',
    'uploadCatalogMedia',
    'deleteCatalogMedia',
  ],
  'crm/quote-drafts.openapi.yaml': [
    'getCrmQuotes',
    'getCrmQuote',
    'createCrmQuote',
    'saveCrmQuoteVersion',
    'previewCrmQuotePrices',
    'prepareCrmQuote',
  ],
  'crm/issuer-settings.openapi.yaml': [
    'getCrmIssuerSettings',
    'createCrmIssuerSettingsVersion',
    'activateCrmIssuerSettings',
  ],
  'crm/introduction-templates.openapi.yaml': [
    'getCrmIntroductionTemplates',
    'createCrmIntroductionTemplate',
    'getCrmIntroductionTemplate',
    'reviseCrmIntroductionTemplate',
    'setCrmIntroductionTemplateArchived',
    'checkCrmIntroductionTemplate',
    'applyCrmIntroductionTemplate',
    'getCrmIntroductionFeaturedMapping',
    'activateCrmIntroductionFeaturedMapping',
  ],
  'crm/email-templates.openapi.yaml': ['getCrmActiveEmailTemplate'],
  'crm/quote-deliveries.openapi.yaml': [
    'getCrmQuoteDeliveries',
    'getCrmQuoteDelivery',
    'enqueueCrmQuoteDelivery',
  ],
  'crm/production-packages.openapi.yaml': [
    'exportCrmProductionPackage',
    'getCrmProductionPackage',
    'downloadCrmProductionPackage',
  ],
  'crm/quote-pdf.openapi.yaml': [
    'renderCrmQuotePdf',
    'getCrmQuotePdfArtifact',
    'downloadCrmQuotePdfArtifact',
  ],
};

export function hasOperationId(contract, expected) {
  const declarations = contract.matchAll(
    /^[ \t]*(?:operationId|"operationId"|'operationId'):[ \t]*(?:"([A-Za-z0-9_-]+)"|'([A-Za-z0-9_-]+)'|([A-Za-z0-9_-]+))[ \t]*(?:,[ \t]*)?(?:#.*)?$/gm,
  );
  return [...declarations].some((match) => (match[1] ?? match[2] ?? match[3]) === expected);
}

export function checkRequiredOperations(snapshot) {
  for (const [relativePath, operationIds] of Object.entries(requiredOperations)) {
    const contract = readFileSync(join(snapshot, relativePath), 'utf8');
    for (const operationId of operationIds) {
      if (!hasOperationId(contract, operationId))
        throw Error('Missing operationId: ' + operationId);
    }
  }
}
