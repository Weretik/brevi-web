import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ApiError, mapToApiError } from '@shared/util';

import { NotificationService } from '../services/notification.service';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);
  private readonly notify = inject(NotificationService);

  handleError(error: unknown): void {
    const apiError: ApiError = mapToApiError(error);
    if (this.isApiError(error)) {
      this.toast.error(error.message);
      return;
    }

    console.error(error);
    this.toast.error('Unexpected error occurred');
    this.notify.error('Помилка', apiError.message);
  }

  private isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
  }
}
