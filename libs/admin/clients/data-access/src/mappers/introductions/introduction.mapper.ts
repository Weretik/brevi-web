import {
  quoteArray,
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteMoney,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';
import { mapQuoteResultPage } from '../quotes/quote-result-page.mapper';

import type {
  IntroductionFormat,
  IntroductionSelection,
  IntroductionSlotUid,
  IntroductionTemplateSummary,
  IntroductionTemplateDetail,
  IntroductionTemplatePage,
  IntroductionPreparedDraft,
  IntroductionFeaturedMapping,
} from '@admin/clients/model';

function text(value: unknown, max = 500): string {
  const s = quoteText(value);
  if (!s.trim() || s.length > max) throw Error('Некоректний текст добірки.');
  return s;
}
function format(value: unknown): IntroductionFormat {
  if (value === 0) return 'general';
  if (value === 1) return 'summer';
  if (value === 2) return 'winter';
  throw Error('Невідомий формат добірки.');
}
function selection(value: unknown): IntroductionSelection {
  const row = quoteRecord(value);
  const slot = quoteRecord(row['slot']);
  const position = quoteInteger(slot['position'], 0);
  const season = slot['season'];
  if (
    (season !== 0 && season !== 1) ||
    position > 3 ||
    slot['uid'] !== (season === 0 ? 100 : 200) + position
  )
    throw Error('Некоректна позиція добірки.');
  return {
    slotUid: slot['uid'] as IntroductionSlotUid,
    productId: quoteInteger(row['productId']),
    articleId: quoteInteger(row['articleId']),
  };
}
function validateSlots(f: IntroductionFormat, rows: readonly IntroductionSelection[]) {
  const expected =
    f === 'general'
      ? [100, 101, 102, 103, 200, 201, 202, 203]
      : f === 'summer'
        ? [100, 101, 102, 103]
        : [200, 201, 202, 203];
  if (
    rows.length !== expected.length ||
    new Set(rows.map((x) => x.slotUid)).size !== rows.length ||
    rows.some((x) => !expected.includes(x.slotUid))
  )
    throw Error('Неповна добірка.');
  for (const season of [100, 200]) {
    const page = rows.filter((x) => Math.floor(x.slotUid / 100) * 100 === season);
    if (new Set(page.map((x) => x.productId)).size !== page.length)
      throw Error('Повтор моделі у добірці.');
  }
}
export function mapIntroductionSummary(value: unknown): IntroductionTemplateSummary {
  const row = quoteRecord(value);
  return {
    id: quoteId(row['templatePublicId']),
    ownerId: quoteInteger(row['ownerId']),
    revision: quoteInteger(row['revision']),
    archived: quoteFlag(row['archived']),
    versionId: quoteId(row['versionPublicId']),
    versionNumber: quoteInteger(row['versionNumber']),
    name: text(row['name'], 300),
    updatedAt: quoteDate(row['updatedAt']),
  };
}
export function mapIntroductionDetail(value: unknown): IntroductionTemplateDetail {
  const row = quoteRecord(value),
    snapshot = quoteRecord(row['snapshot']);
  const f = format(snapshot['layout']);
  const selections = quoteArray(snapshot['selections'], 8).map(selection);
  validateSlots(f, selections);
  return {
    ...mapIntroductionSummary(row),
    format: f,
    emailTemplateVersionId: quoteId(snapshot['emailTemplateVersionId']),
    mappingVersionId: quoteId(snapshot['mappingVersionId']),
    selections,
  };
}
export function mapIntroductionPage(value: unknown): IntroductionTemplatePage {
  return mapQuoteResultPage(value, mapIntroductionSummary);
}
export function mapIntroductionPrepared(value: unknown): IntroductionPreparedDraft {
  const row = quoteRecord(value),
    f = format(row['layout']);
  const slots = quoteArray(row['slots'], 8).map((value) => {
    const item = quoteRecord(value),
      selected = selection(item['selection']);
    const price = quoteMoney(item['largeWholesale']);
    const url = text(item['productUrl'], 2048);
    const parsed = new URL(url);
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      parsed.pathname === '/' ||
      !(parsed.hostname === 'brevi.com.ua' || parsed.hostname.endsWith('.brevi.com.ua')) ||
      price === null ||
      price <= 0
    )
      throw Error('Некоректна публічна позиція добірки.');
    return {
      ...selected,
      modelName: text(item['modelName']),
      fabricName: text(item['fabricName']),
      fabricComposition: text(item['fabricComposition']),
      fabricDensity: text(item['fabricDensity']),
      productUrl: url,
      largeWholesale: price,
    };
  });
  validateSlots(f, slots);
  return {
    format: f,
    mappingVersionId: quoteId(row['mappingVersionId']),
    emailTemplateVersionId: quoteId(row['emailTemplateVersionId']),
    slots,
  };
}
export function mapIntroductionMapping(value: unknown): IntroductionFeaturedMapping {
  const row = quoteRecord(value);
  const summerProductId = quoteInteger(row['summerProductId']),
    winterProductId = quoteInteger(row['winterProductId']);
  if (summerProductId === winterProductId) throw Error('Некоректні сезонні моделі.');
  return { versionId: quoteId(row['versionId']), summerProductId, winterProductId };
}
