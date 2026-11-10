export type {
  AgreementSection as AgreementSectionData,
  AgreementText,
} from './lib/data/agreement-text';
export {
  AGREEMENT_TAX_ID,
  agreementSectionId,
  getAgreementDictionary,
  getAgreementText,
} from './lib/i18n/agreement-dictionary';
export type { AgreementDictionary } from './lib/i18n/agreement-dictionary';
export { AgreementContents } from './lib/sections/agreement-contents';
export { AgreementRequisites } from './lib/sections/agreement-requisites';
export { AgreementSection } from './lib/sections/agreement-section';
