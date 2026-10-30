import type { CustomTemplateSummary } from './custom-template-summary';

export interface CustomTemplatePage {
  readonly rows: readonly CustomTemplateSummary[];
  readonly page: number;
  readonly totalPages: number;
}
