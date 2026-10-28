import type { CustomerChannel } from '../entities/contacts/customer-channel';

export interface ContactDraft {
  name: string;
  position: string;
  active: boolean;
  isPrimary: boolean;
  channels: readonly CustomerChannel[];
}
