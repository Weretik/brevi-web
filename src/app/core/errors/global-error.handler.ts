import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ApiError } from './api-error';
import { ToastService } from '@app/core/services/toast.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toast = inject(ToastService);

  handleError(error: unknown): void {
    if (this.isApiError(error)) {
      this.toast.error(error.message);
      return;
    }

    console.error(error);
    this.toast.error('Unexpected error occurred');
  }

  private isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
  }
}
