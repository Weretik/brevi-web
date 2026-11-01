export interface EmailTemplateView {
  readonly id: string;
  readonly label: string;
  readonly number: number;
}

export interface EmailTemplateSummaryView extends EmailTemplateView {
  readonly subject: string;
  readonly createdAt: string;
}

export interface EmailTemplateDetailView extends EmailTemplateSummaryView {
  readonly body: string;
}

export interface EmailTemplateSettingsView {
  readonly revision: number;
  readonly active: EmailTemplateDetailView | null;
}

export interface EmailTemplatePageView {
  readonly rows: readonly EmailTemplateSummaryView[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}
