import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';

export interface QuoteLifecycleDialogProps {
  readonly detail: QuoteDetail;
  readonly pending: boolean;
  readonly uncertain: boolean;
  readonly error: string;
  readonly onCancel: () => void;
  readonly onConfirm: (intent: QuoteLifecycleIntent) => void;
  readonly onRetry: () => void;
}
