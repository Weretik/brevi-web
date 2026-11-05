/** One calculation of the old calculator's transfer file; the server checks the rest of the shape. */
export interface EmbroideryArchiveRow {
  readonly legacyId: string;
  readonly [field: string]: unknown;
}

export type EmbroideryArchiveAction = 'created' | 'unchanged' | 'error';

export interface EmbroideryArchiveLine {
  legacyId: string;
  name: string;
  createdAt: string;
  createdByName: string;
  action: EmbroideryArchiveAction;
  message: string | null;
  /** «ВШ-0042» once saved. */
  number: string | null;
}

/** What «Імпорт архіву» will do (dryRun) or did. */
export interface EmbroideryArchiveResult {
  dryRun: boolean;
  created: number;
  unchanged: number;
  errors: number;
  lines: readonly EmbroideryArchiveLine[];
}

export interface EmbroideryArchiveFile {
  rows: EmbroideryArchiveRow[];
  error: string | null;
}
