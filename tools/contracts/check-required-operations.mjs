import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Contract slices required by current Admin consumers, grouped by canonical source. */
const requiredOperations = {
  'identity/session.openapi.yaml': [
    'loginCookieSession',
    'logoutCookieSession',
    'getCurrentSession',
  ],
  'identity/users.openapi.yaml': [
    'getStaffAccounts',
    'createStaffAccount',
    'changeStaffRole',
    'setStaffBlocked',
    'setStaffPassword',
    'deleteStaffAccount',
    'updateStaffDetails',
  ],
  'identity/profile.openapi.yaml': [
    'getMyProfile',
    'changeMyName',
    'changeMyPhone',
    'uploadMyAvatar',
    'removeMyAvatar',
    'changeMyEmail',
    'changeMyPassword',
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
  'reference/pricing-parameters.openapi.yaml': [
    'getPricingParameters',
    'createPricingParameter',
    'updatePricingParameter',
    'deletePricingParameter',
    'getPpeMarkupRules',
    'createPpeMarkupRule',
    'updatePpeMarkupRule',
    'deletePpeMarkupRule',
  ],
  'catalog/product-catalog.openapi.yaml': [
    'getAdminProducts',
    'getAdminProductById',
    'createProduct',
    'replaceProduct',
    'deleteProduct',
  ],
  'catalog/product-dependencies.openapi.yaml': ['getAdminProductCategories'],
  'media/media-library.openapi.yaml': [
    'getMediaFolders',
    'createMediaFolder',
    'updateMediaFolder',
    'deleteMediaFolder',
    'searchMediaFiles',
    'getMediaFile',
    'uploadMediaFile',
    'updateMediaFile',
    'moveMediaFiles',
    'deleteMediaFile',
  ],
  'crm/quotes.openapi.yaml': [
    'getCrmQuotes',
    'createCrmQuote',
    'getCrmQuote',
    'saveCrmQuote',
    'deleteCrmQuote',
    'repriceCrmQuote',
    'setCrmQuoteResponsible',
    'searchCrmQuoteCatalog',
    'getCrmQuoteStaff',
    'getCrmQuotePdf',
    'getCrmQuoteSettings',
    'saveCrmQuoteSettings',
    'getCrmQuoteSendDraft',
    'sendCrmQuote',
    'connectCrmMailbox',
    'disconnectCrmMailbox',
    'createCrmQuoteIntroduction',
    'saveCrmQuoteIntroduction',
    'getCrmQuoteIntroductionSetup',
    'getCrmQuoteCatalogProducts',
    'calculateCrmQuoteCustomSewing',
    'getCrmQuoteModelComposition',
    'getCrmQuoteIntroTemplates',
    'createCrmQuoteIntroTemplate',
    'deleteCrmQuoteIntroTemplate',
    'getCrmQuoteHistory',
    'getCrmLegacyArchivedQuotes',
    'purgeCrmLegacyArchivedQuotes',
    'uploadCrmQuotePhoto',
    'copyCrmQuote',
    'addCrmQuoteEmbroidery',
  ],
  'crm/embroidery.openapi.yaml': [
    'getCrmEmbroideryForm',
    'calculateCrmEmbroidery',
    'getCrmEmbroiderySettings',
    'saveCrmEmbroiderySettings',
    'getCrmEmbroideryCalculations',
    'getCrmEmbroideryCalculation',
    'saveCrmEmbroideryCalculation',
    'deleteCrmEmbroideryCalculation',
    'setCrmEmbroideryMockup',
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
