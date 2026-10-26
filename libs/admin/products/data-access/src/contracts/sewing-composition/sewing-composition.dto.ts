import type { operations } from '@admin/shared/contracts';

export type SewingCompositionDto =
  operations['getSewingComposition']['responses'][200]['content']['application/json'];
