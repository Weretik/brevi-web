import type { operations } from '@admin/shared/contracts';

export type SewingPublicationDto =
  operations['getPublishedSewingPrice']['responses'][200]['content']['application/json'];
