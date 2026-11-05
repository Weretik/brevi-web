import type { EmbroideryArchiveResult, EmbroideryArchiveRow } from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The transfer file is already in the API shape; the server validates every field. */
export const toEmbroideryArchiveRows = (
  rows: readonly EmbroideryArchiveRow[],
): Schemas['CrmEmbroideryArchiveRow'][] => rows as unknown as Schemas['CrmEmbroideryArchiveRow'][];

export const mapEmbroideryArchiveResult = (
  value: Schemas['CrmEmbroideryArchiveImportResult'],
): EmbroideryArchiveResult => ({
  dryRun: value.dryRun,
  created: value.created,
  unchanged: value.unchanged,
  errors: value.errors,
  lines: value.lines.map((line) => ({
    legacyId: line.legacyId,
    name: line.name,
    createdAt: line.createdAt,
    createdByName: line.createdByName,
    action: line.action,
    message: line.message ?? null,
    number: line.number ?? null,
  })),
});
