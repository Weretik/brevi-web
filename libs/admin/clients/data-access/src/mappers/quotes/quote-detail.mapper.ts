import { mapQuoteVersion } from './quote-version.mapper';
import {
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteNullableId,
  quoteNullableText,
  quoteRecord,
  quoteState,
} from '../../validators/quotes/quote-response-values';

import type { QuoteDetail } from '@admin/clients/model';

export function mapQuoteDetail(value: unknown): QuoteDetail {
  const row = quoteRecord(value);
  const version = mapQuoteVersion(row['version']);
  quoteDate(row['createdAt']);
  return {
    publicId: quoteId(row['publicId']),
    versionId: version.publicId,
    sourceQuoteId: quoteNullableId(row['sourceQuoteId']),
    sourceVersionId: quoteNullableId(row['sourceVersionId']),
    revision: quoteInteger(row['revision']),
    versionNumber: version.versionNumber,
    state: quoteState(row['state']),
    archived: quoteFlag(row['archived']),
    number: quoteNullableText(row['number']),
    ownerId: quoteInteger(row['ownerId']),
    versionActorId: version.actorId,
    updatedAt: quoteDate(row['updatedAt']),
    canEdit: quoteFlag(row['canEdit']),
    draft: version.draft,
  };
}
