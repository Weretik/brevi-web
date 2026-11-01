import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';
import { mapQuoteResultPage } from '../quotes/quote-result-page.mapper';

import type {
  EmailTemplateSummaryView,
  EmailTemplateDetailView,
  EmailTemplatePageView,
  EmailTemplateSettingsView,
} from '@admin/clients/model';

function mapEmailTemplateSummary(value: unknown): EmailTemplateSummaryView {
  const row = quoteRecord(value);
  const label = quoteText(row['name']);
  const subject = quoteText(row['subject']);
  if (
    !label.trim() ||
    label.length > 120 ||
    !subject.trim() ||
    subject.length > 200 ||
    /[\r\n]/.test(subject)
  )
    throw new Error('Некоректний шаблон листа.');
  return {
    id: quoteId(row['versionId']),
    number: quoteInteger(row['number']),
    label,
    subject,
    createdAt: quoteDate(row['createdAt']),
  };
}

export function mapEmailTemplateDetail(value: unknown): EmailTemplateDetailView {
  const row = quoteRecord(value);
  const body = quoteText(row['body']);
  if (!body.trim() || body.length > 3000) throw new Error('Некоректний текст листа.');
  return { ...mapEmailTemplateSummary(row), body };
}

export function mapEmailTemplateSettings(value: unknown): EmailTemplateSettingsView {
  const row = quoteRecord(value);
  return {
    revision: quoteInteger(row['revision']),
    active: row['active'] === null ? null : mapEmailTemplateDetail(row['active']),
  };
}

export function mapEmailTemplatePage(value: unknown): EmailTemplatePageView {
  const page = mapQuoteResultPage(value, mapEmailTemplateSummary);
  if (
    new Set(page.rows.map((row) => row.id.toLowerCase())).size !== page.rows.length ||
    page.rows.length > page.total ||
    page.totalPages !== Math.ceil(page.total / page.pageSize)
  )
    throw new Error('Некоректна сторінка шаблонів листів.');
  return page;
}
