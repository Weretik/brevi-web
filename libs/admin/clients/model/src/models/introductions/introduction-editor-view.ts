import type { IntroductionFormat, IntroductionSeason } from './introduction-layout';

export interface IntroductionModelOption {
  readonly productId: number;
  readonly label: string;
  readonly season?: IntroductionSeason;
}
export interface IntroductionArticleOption {
  readonly articleId: number;
  readonly label: string;
  readonly description?: string;
}
export interface IntroductionTemplateFormValue {
  readonly name: string;
  readonly format: IntroductionFormat;
  readonly emailTemplateVersionId: string;
}
export interface IntroductionEmailTemplateOption {
  readonly id: string;
  readonly label: string;
}
export interface IntroductionSavedTemplateView {
  readonly id: string;
  readonly name: string;
  readonly revision: number;
  readonly archived: boolean;
  readonly formatLabel?: string;
}
