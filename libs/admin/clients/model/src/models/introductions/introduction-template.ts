import type { IntroductionFormat } from './introduction-layout';

export type IntroductionSlotUid = 100 | 101 | 102 | 103 | 200 | 201 | 202 | 203;
export interface IntroductionSelection {
  slotUid: IntroductionSlotUid;
  productId: number;
  articleId: number;
}
export interface IntroductionTemplateSummary {
  id: string;
  ownerId: number;
  revision: number;
  archived: boolean;
  versionId: string;
  versionNumber: number;
  name: string;
  updatedAt: string;
}
export interface IntroductionTemplateDetail extends IntroductionTemplateSummary {
  format: IntroductionFormat;
  emailTemplateVersionId: string;
  mappingVersionId: string;
  selections: IntroductionSelection[];
}
export interface IntroductionTemplatePage {
  rows: readonly IntroductionTemplateSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export interface IntroductionPreparedSlot extends IntroductionSelection {
  modelName: string;
  fabricName: string;
  fabricComposition: string;
  fabricDensity: string;
  productUrl: string;
  largeWholesale: number;
}
export interface IntroductionPreparedDraft {
  format: IntroductionFormat;
  mappingVersionId: string;
  emailTemplateVersionId: string;
  slots: IntroductionPreparedSlot[];
}
export interface IntroductionFeaturedMapping {
  versionId: string;
  summerProductId: number;
  winterProductId: number;
}
export interface IntroductionTemplateWrite {
  requestId: string;
  name: string;
  format: IntroductionFormat;
  emailTemplateVersionId: string;
  selections: IntroductionSelection[];
}
export interface IntroductionApply {
  id: string;
  requestId: string;
  versionId?: string;
  customerId: string | null;
  contactId: string | null;
  recipientName: string | null;
}
export interface IntroductionMappingActivation {
  snapshotHash: string;
  summerModelCode: string;
  winterModelCode: string;
}
