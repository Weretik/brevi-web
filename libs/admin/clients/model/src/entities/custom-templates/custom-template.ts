import type { CustomTemplateSelections } from './custom-template-selections';
import type { CustomTemplateSummary } from './custom-template-summary';

export interface CustomTemplateDetail extends CustomTemplateSummary {
  readonly versionId: string;
  readonly introduction: string;
  readonly selections: CustomTemplateSelections;
  readonly canEdit: boolean;
}
export type { CustomTemplateSelections } from './custom-template-selections';
export type { CustomTemplateSummary } from './custom-template-summary';
export type { CustomTemplatePage } from './custom-template-page';
