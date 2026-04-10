import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { AppLogger } from '@shared/logging';
import { ApiError, mapToApiError } from '@shared/util';

import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notify = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly logger = inject(AppLogger);

  handleError(error: unknown): void {
    this.logger.logClientError(error);

    if (this.isIgnorableRuntimeError(error)) {
      console.warn('Ignored non-actionable runtime error:', error);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const errorStr = (
        (error as { message?: string })?.message ||
        error?.toString() ||
        ''
      ).toLowerCase();
      const isChunkError =
        errorStr.includes('loading chunk') ||
        errorStr.includes('failed to load module script') ||
        errorStr.includes('failed to fetch dynamically imported module');

      if (isChunkError) {
        console.warn('Chunk loading error detected. Reloading page...', error);
        window.location.reload();
        return;
      }
    }

    const apiError: ApiError = mapToApiError(error);
    if (this.isApiError(error)) {
      this.notify.error(error.message);
      return;
    }

    console.error(error);
    this.notify.error('Помилка', apiError.message);
  }

  private isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
  }

  private isIgnorableRuntimeError(error: unknown): boolean {
    const toText = (value: unknown): string =>
      typeof value === 'string'
        ? value
        : value instanceof Error
          ? value.message
          : value != null
            ? String(value)
            : '';

    const candidateTexts = [
      toText(error),
      toText((error as { message?: unknown } | null)?.message),
      toText((error as { reason?: unknown } | null)?.reason),
      toText((error as { rejection?: unknown } | null)?.rejection),
    ]
      .join(' ')
      .toLowerCase();

    return (
      candidateTexts.includes('script error') ||
      candidateTexts.includes('resizeobserver loop limit exceeded') ||
      candidateTexts.includes('non-error promise rejection captured')
    );
  }
}
