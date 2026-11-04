import type { QuotePerson } from './quote';
import type { QuoteCatalogProduct } from './quote-catalog';

/** «Загальне» = summer and winter pages; «Літній» or «Зимовий» = one page. */
export type QuoteIntroLayout = 'General' | 'Summer' | 'Winter';
export type QuoteIntroSeason = 'Summer' | 'Winter';

/** The fields only a «КП для знайомства» has. */
export interface QuoteIntroduction {
  readonly layout: QuoteIntroLayout;
  readonly recipientEmail: string | null;
  readonly letterName: string | null;
}

/** The fixed first model of a season page; `problem` says why the page cannot be built. */
export interface QuoteIntroMainModel {
  readonly code: string;
  readonly product: QuoteCatalogProduct | null;
  readonly problem: string | null;
}

export interface QuoteIntroLetter {
  readonly name: string;
  readonly subject: string;
}

/** What the introduction editor starts from. */
export interface QuoteIntroductionSetup {
  readonly summer: QuoteIntroMainModel;
  readonly winter: QuoteIntroMainModel;
  readonly letters: readonly QuoteIntroLetter[];
}

export interface QuoteIntroTemplateModel {
  readonly productId: number;
  readonly articleId: number;
  /** The names when the template was saved. */
  readonly productName: string;
  readonly fabricTitle: string;
}

export interface QuoteIntroTemplatePage {
  readonly season: QuoteIntroSeason;
  readonly models: readonly QuoteIntroTemplateModel[];
}

/** «Готовий шаблон»: a saved choice of models and fabrics, without prices. */
export interface QuoteIntroTemplate {
  readonly id: number;
  readonly name: string;
  readonly layout: QuoteIntroLayout;
  readonly letterName: string | null;
  readonly pages: readonly QuoteIntroTemplatePage[];
  readonly author: QuotePerson;
  readonly createdAt: string;
  readonly canDelete: boolean;
}
