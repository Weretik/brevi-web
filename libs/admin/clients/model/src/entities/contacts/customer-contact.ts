import type { CustomerChannel } from './customer-channel';

export interface CustomerContact {
  readonly publicId: string;
  readonly name: string;
  readonly position: string | null;
  readonly active: boolean;
  readonly isPrimary: boolean;
  readonly channels: readonly CustomerChannel[];
}
