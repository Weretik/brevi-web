import {
  purchaseDocumentSources,
  purchaseDocumentVats,
  purchaseRecognitionResults,
} from '@admin/purchasing/model';

import {
  amount,
  dateTime,
  flag,
  integer,
  list,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/purchase-response';

import type {
  PurchaseDocument,
  PurchaseDocumentItem,
  PurchaseDocumentSave,
  PurchaseRecognition,
  PurchaseRecognitionAttempt,
  PurchaseRecognitionBatch,
} from '@admin/purchasing/model';

function mapItem(value: unknown): PurchaseDocumentItem {
  const row = record(value, 'позиція');
  return {
    position: integer(row['position'], 'номер позиції', 1),
    name: text(row['name'], 'назва позиції'),
    quantity: text(row['quantity'], 'кількість'),
    unit: nullableText(row['unit'], 'одиниця'),
    price: text(row['price'], 'ціна'),
    sum: text(row['sum'], 'сума позиції'),
  };
}

export function mapPurchaseDocument(value: unknown): PurchaseDocument | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'документ');
  return {
    documentType: text(row['documentType'], 'вид документа'),
    documentNumber: text(row['documentNumber'], 'номер'),
    documentDate: text(row['documentDate'], 'дата документа'),
    supplierName: text(row['supplierName'], 'постачальник документа'),
    vat: oneOf(row['vat'], purchaseDocumentVats, 'ПДВ'),
    pricesIncludeVat: flag(row['pricesIncludeVat'], 'ціни з ПДВ'),
    vatAmount: nullableText(row['vatAmount'], 'сума ПДВ'),
    totalPayable: text(row['totalPayable'], 'до оплати'),
    items: list(row['items'], 'позиції').map(mapItem),
    source: oneOf(row['source'], purchaseDocumentSources, 'джерело'),
    model: nullableText(row['model'], 'модель'),
    checkedBy: text(row['checkedBy'], 'хто перевірив'),
    checkedAt: dateTime(row['checkedAt'], 'коли перевірено'),
  };
}

const problems = (value: unknown) => list(value, 'проблеми').map((item) => text(item, 'проблема'));

export function mapPurchaseRecognitionAttempt(value: unknown): PurchaseRecognitionAttempt | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'розпізнавання');
  return {
    result: oneOf(row['result'], purchaseRecognitionResults, 'результат'),
    problems: problems(row['problems']),
    model: nullableText(row['model'], 'модель'),
    costUsd: amount(row['costUsd'], 'вартість'),
    by: text(row['by'], 'хто запустив'),
    at: dateTime(row['at'], 'коли'),
  };
}

export function mapPurchaseRecognition(value: unknown): PurchaseRecognition {
  const row = record(value, 'розпізнавання');
  return {
    fileId: text(row['fileId'], 'id файлу'),
    result: oneOf(row['result'], purchaseRecognitionResults, 'результат'),
    problems: problems(row['problems']),
    model: nullableText(row['model'], 'модель'),
    costUsd: amount(row['costUsd'], 'вартість'),
  };
}

export function mapPurchaseRecognitionBatch(value: unknown): PurchaseRecognitionBatch {
  const row = record(value, 'пакет розпізнавання');
  return {
    recognized: integer(row['recognized'], 'розпізнано'),
    needsReview: integer(row['needsReview'], 'потребують перевірки'),
    failed: integer(row['failed'], 'не вдалося'),
    skipped: integer(row['skipped'], 'пропущено'),
    remaining: integer(row['remaining'], 'залишилось'),
    costUsd: amount(row['costUsd'], 'вартість'),
    stopReason: nullableText(row['stopReason'], 'причина зупинки'),
  };
}

export function mapPurchaseDocumentSave(value: unknown): PurchaseDocumentSave {
  const row = record(value, 'збереження документа');
  return {
    fileId: text(row['fileId'], 'id файлу'),
    unchanged: flag(row['unchanged'], 'без змін'),
    replaced: flag(row['replaced'], 'замінено'),
  };
}
