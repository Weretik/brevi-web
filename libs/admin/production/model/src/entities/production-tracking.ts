/** Етапи of an item in the order the workshop goes through them. */
export const productionStages = [
  'New',
  'FabricOrdered',
  'FabricAvailable',
  'Cutting',
  'Application',
  'Sewing',
  'Ready',
  'Shipped',
  'Complete',
] as const;

export type ProductionStage = (typeof productionStages)[number];

export const productionStageLabels: Record<ProductionStage, string> = {
  New: 'Нове',
  FabricOrdered: 'Тканина замовлена',
  FabricAvailable: 'Тканина в наявності',
  Cutting: 'Крій',
  Application: 'Нанесення',
  Sewing: 'Пошив',
  Ready: 'Готово до відвантаження',
  Shipped: 'Фактично відвантажено',
  Complete: 'Завершено',
};

/** Ticked stages kept in the workshop order without repeats; none ticked means «Нове». */
export function normalizeStages(stages: readonly ProductionStage[]): ProductionStage[] {
  const result = productionStages.filter((stage) => stages.includes(stage));
  return result.length ? result : ['New'];
}

/** Ticks or unticks one stage. */
export function toggleStage(stages: readonly ProductionStage[], stage: ProductionStage) {
  return normalizeStages(
    stages.includes(stage) ? stages.filter((x) => x !== stage) : [...stages, stage],
  );
}

export type ProductionFileKind = 'Sizes' | 'Application' | 'Extra' | 'Photo';

export const productionFileKinds: readonly ProductionFileKind[] = [
  'Sizes',
  'Application',
  'Extra',
  'Photo',
];

export const productionFileKindLabels: Record<ProductionFileKind, string> = {
  Sizes: 'Розміри',
  Application: 'Нанесення',
  Extra: 'Додатковий файл',
  Photo: 'Фото',
};

/** 20 MB, as on the server. */
export const PRODUCTION_FILE_MAX_BYTES = 20 * 1024 * 1024;
export const PRODUCTION_TEXT_MAX_LENGTH = 1000;

export interface ProductionShipment {
  id: number;
  quantity: number;
  shippedOn: string;
  comment: string | null;
  createdByName: string;
  createdAt: string;
}

export interface ProductionOrderFile {
  id: number;
  /** null for a file of the whole order. */
  itemId: number | null;
  kind: ProductionFileKind;
  name: string;
  contentType: string;
  bytes: number;
  url: string;
  /** A Google Drive link moved from the old «Цех». */
  isOldLink: boolean;
  createdByName: string;
  createdAt: string;
}

export type TelegramDeliveryStatus = 'NotSent' | 'Sending' | 'Sent' | 'Failed';

/** The one message about the order to the workshop group. */
export interface ProductionTelegram {
  status: TelegramDeliveryStatus;
  sentAt: string | null;
  sentByName: string | null;
  /** Why the last send failed. */
  error: string | null;
  /** The workshop group is set and sending is on. */
  ready: boolean;
}

export interface WorkshopTelegramChat {
  chatId: number;
  title: string;
}

/** «Налаштування цеху». */
export interface WorkshopSettings {
  telegramEnabled: boolean;
  telegramChatId: number | null;
  telegramThreadId: number | null;
  /** The server has the bot token. */
  botConfigured: boolean;
  /** Groups the Brevi bot is in. */
  chats: WorkshopTelegramChat[];
  updatedByName: string | null;
  updatedAt: string | null;
}

export interface WorkshopSettingsBody {
  telegramEnabled: boolean;
  telegramChatId: number | null;
  telegramThreadId: number | null;
}

export interface CreateProductionShipmentBody {
  version: number;
  quantity: number;
  shippedOn: string;
  comment: string | null;
}

/** КП prices of an order of the old «Цех» from production-report-prices.json. */
export interface ProductionReportPriceImportRow {
  legacyId: string;
  items: { position: number; unitPrice: number }[];
}

/** Progress of an order of the old «Цех» from production-progress.json. */
export interface ProductionProgressImportRow {
  legacyId: string;
  items: { position: number; stages: ProductionStage[] }[];
  files: {
    position: number | null;
    kind: ProductionFileKind;
    name: string;
    contentType: string;
    bytes: number;
    url: string;
    createdAt: string;
    createdByName: string | null;
  }[];
  telegramSent: boolean;
  telegramSentAt: string | null;
}
