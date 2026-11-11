import type {
  StockTransferInput,
  StockTransferTable,
  V133Row,
} from '../../entities/transfer/stock-transfer';

interface TableSpec {
  /** The D1 table, which is also the file name without `.jsonl`. */
  table: string;
  columns: readonly string[];
}

/** The columns the transfer reads; the other columns of the export stay on the computer. */
export const v133Tables: Readonly<Record<StockTransferTable, TableSpec>> = {
  fabricStock: {
    table: 'fabric_stock',
    columns: [
      'id',
      'fabricId',
      'fabricName',
      'color',
      'normalizedColor',
      'hundredthsOfMeter',
      'lastMovementId',
      'updatedAt',
    ],
  },
  fabricStockMovements: {
    table: 'fabric_stock_movements',
    columns: [
      'id',
      'stockId',
      'fabricId',
      'fabricName',
      'color',
      'kind',
      'beforeHundredths',
      'deltaHundredths',
      'afterHundredths',
      'orderId',
      'itemId',
      'orderNumber',
      'modelName',
      'clientName',
      'itemQuantity',
      'supplier',
      'reference',
      'note',
      'actorEmail',
      'at',
      'operationDate',
    ],
  },
  fabricMovementRevisions: {
    table: 'fabric_movement_revisions',
    columns: ['id', 'operationId', 'movementId', 'beforeJson', 'afterJson', 'actorEmail', 'at'],
  },
  fabricIssueBatches: {
    table: 'fabric_issue_batches',
    columns: ['id', 'itemId', 'actorEmail', 'resultJson', 'createdAt'],
  },
  fabricIssueLines: {
    table: 'fabric_issue_lines',
    columns: [
      'id',
      'batchId',
      'itemId',
      'stockId',
      'purpose',
      'planKey',
      'plannedFabricId',
      'plannedColor',
      'plannedHundredths',
      'actualFabricId',
      'actualColor',
      'actualHundredths',
      'coveredPlanHundredths',
      'note',
      'createdAt',
      'plannedComponentJson',
      'voidedAt',
    ],
  },
  fabricIssueComponents: {
    table: 'fabric_issue_components',
    columns: ['movementId', 'lineId'],
  },
  fabricReservations: {
    table: 'fabric_reservations',
    columns: ['id', 'orderId', 'itemId', 'fabricId', 'color', 'hundredthsOfMeter'],
  },
  productionOrders: {
    table: 'production_orders',
    columns: ['id', 'seq', 'status', 'deletedAt'],
  },
  productionItems: {
    table: 'production_items',
    columns: ['id', 'orderId', 'modelArticle', 'modelName', 'quantity'],
  },
};

export interface V133ExportFile {
  name: string;
  text: string;
}

export interface V133ExportResult {
  input: StockTransferInput | null;
  /** Tables of the transfer with no file among the ones picked. */
  missing: string[];
  error: string | null;
}

const camel = (key: string) => key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const fileTable = (name: string) =>
  name
    .split(/[\\/]/)
    .pop()
    ?.replace(/\.jsonl$/i, '')
    .toLowerCase() ?? '';

/** One JSONL line → only the transfer's columns, absent ones as null; nested values stay text. */
function row(line: string, columns: readonly string[]): V133Row {
  const parsed: unknown = JSON.parse(line);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not a row');
  const source = new Map(
    Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [camel(key), value]),
  );
  const result: Record<string, string | number | null> = {};
  for (const column of columns) {
    const value = source.get(column);
    result[column] =
      value === undefined || value === null
        ? null
        : typeof value === 'number' || typeof value === 'string'
          ? value
          : JSON.stringify(value);
  }
  return result;
}

/**
 * The JSONL files of the D1 export (`fabric_stock.jsonl` and the others) → the body of the
 * transfer. Rows keep the order of the file: the order of `production_items` is their position.
 */
export function readV133Export(files: V133ExportFile[], snapshot: string): V133ExportResult {
  const byTable = new Map(files.map((file) => [fileTable(file.name), file]));
  const tables = Object.entries(v133Tables) as [StockTransferTable, TableSpec][];
  const missing = tables
    .filter(([, spec]) => !byTable.has(spec.table))
    .map(([, spec]) => `${spec.table}.jsonl`);
  if (missing.length > 0) return { input: null, missing, error: null };

  const input: StockTransferInput = {
    snapshot: snapshot.trim() || null,
    fabricStock: [],
    fabricStockMovements: [],
    fabricMovementRevisions: [],
    fabricIssueBatches: [],
    fabricIssueLines: [],
    fabricIssueComponents: [],
    fabricReservations: [],
    productionOrders: [],
    productionItems: [],
  };
  for (const [key, spec] of tables) {
    const file = byTable.get(spec.table);
    if (!file) continue;
    const lines = file.text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]?.trim();
      if (!line) continue;
      try {
        input[key].push(row(line, spec.columns));
      } catch {
        return {
          input: null,
          missing: [],
          error: `${file.name}, рядок ${index + 1}: це не рядок JSON.`,
        };
      }
    }
  }
  return { input, missing: [], error: null };
}
