import { productionFileKinds, productionStages } from '@admin/production/model';

import {
  boolean,
  dateTime,
  day,
  integer,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/production-response';

import type {
  ProductionImportResult,
  ProductionOrderFile,
  ProductionShipment,
  ProductionStage,
  ProductionTelegram,
  TelegramDeliveryStatus,
  WorkshopSettings,
} from '@admin/production/model';

const deliveryStatuses = [
  'NotSent',
  'Sending',
  'Sent',
  'Failed',
] as const satisfies readonly TelegramDeliveryStatus[];

/** Telegram group ids are negative. */
const chatId = (value: unknown, what: string) => integer(value, what, Number.MIN_SAFE_INTEGER);

export const stage = (value: unknown, what: string): ProductionStage =>
  oneOf(value, productionStages, what);

export const stages = (value: unknown): ProductionStage[] =>
  list(value, 'етапи').map((x) => stage(x, 'етап'));

export function mapShipment(value: unknown): ProductionShipment {
  const row = record(value, 'відвантаження');
  return {
    id: integer(row['id'], 'id відвантаження', 1),
    quantity: integer(row['quantity'], 'кількість відвантаження', 1),
    shippedOn: day(row['shippedOn'], 'дата відвантаження'),
    comment: nullableText(row['comment'], 'коментар відвантаження'),
    createdByName: nonEmptyText(row['createdByName'], 'хто відвантажив'),
    createdAt: dateTime(row['createdAt'], 'час відвантаження'),
  };
}

export function mapOrderFile(value: unknown): ProductionOrderFile {
  const row = record(value, 'файл');
  return {
    id: integer(row['id'], 'id файлу', 1),
    itemId: nullableInteger(row['itemId'], 'позиція файлу', 1),
    kind: oneOf(row['kind'], productionFileKinds, 'вид файлу'),
    name: nonEmptyText(row['name'], 'назва файлу'),
    contentType: text(row['contentType'], 'тип файлу'),
    bytes: integer(row['bytes'], 'розмір файлу'),
    url: nonEmptyText(row['url'], 'посилання на файл'),
    isOldLink: boolean(row['isOldLink'], 'старе посилання'),
    createdByName: nonEmptyText(row['createdByName'], 'хто додав файл'),
    createdAt: dateTime(row['createdAt'], 'час файлу'),
  };
}

export function mapTelegram(value: unknown): ProductionTelegram {
  const row = record(value, 'Telegram');
  return {
    status: oneOf(row['status'], deliveryStatuses, 'стан Telegram'),
    sentAt: nullableDateTime(row['sentAt'], 'час надсилання'),
    sentByName: nullableText(row['sentByName'], 'хто надіслав'),
    error: nullableText(row['error'], 'помилка Telegram'),
    ready: boolean(row['ready'], 'готовність Telegram'),
  };
}

export function mapWorkshopSettings(value: unknown): WorkshopSettings {
  const row = record(value, 'налаштування цеху');
  const thread = row['telegramThreadId'];
  const chat = row['telegramChatId'];
  return {
    telegramEnabled: boolean(row['telegramEnabled'], 'надсилання'),
    telegramChatId: chat === null || chat === undefined ? null : chatId(chat, 'група'),
    telegramThreadId: thread === null || thread === undefined ? null : integer(thread, 'тема', 1),
    botConfigured: boolean(row['botConfigured'], 'бот'),
    chats: list(row['chats'], 'групи').map((item) => {
      const group = record(item, 'група');
      return {
        chatId: chatId(group['chatId'], 'id групи'),
        title: nonEmptyText(group['title'], 'назва групи'),
      };
    }),
    updatedByName: nullableText(row['updatedByName'], 'хто змінив'),
    updatedAt: nullableDateTime(row['updatedAt'], 'час зміни'),
  };
}

/** Moved progress in the shared import preview: «№ 12» and how many stages and files change. */
export function mapProgressImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: 0,
    updated: integer(row['updated'], 'оновлено'),
    unchanged: integer(row['unchanged'], 'без змін'),
    errors: integer(row['errors'], 'помилки'),
    lines: list(row['lines'], 'рядки імпорту').map((item) => {
      const line = record(item, 'рядок імпорту');
      const number = nullableInteger(line['number'], 'номер', 1);
      return {
        key: number === null ? text(line['legacyId'], 'id завдання') : `№ ${number}`,
        detail: `Етапів: ${integer(line['stages'], 'етапів')} · Файлів: ${integer(line['files'], 'файлів')}`,
        action: oneOf(line['action'], ['updated', 'unchanged', 'error'] as const, 'дія імпорту'),
        error: nullableText(line['error'], 'помилка'),
      };
    }),
  };
}
