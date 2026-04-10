import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppLogger } from '@shared/logging';
import { finalize, tap } from 'rxjs/operators';

import { ENABLE_HTTP_LOGS } from '../api-url.token';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(AppLogger);
  const enableLogs = inject(ENABLE_HTTP_LOGS);
  const started = performance.now();

  return next(req).pipe(
    tap({
      error: (error) => {
        logger.logError(
          {
            method: req.method,
            url: req.url,
            durationMs: performance.now() - started,
            error,
          },
          enableLogs,
        );
      },
    }),
    finalize(() => {
      if (!enableLogs) {
        return;
      }

      const duration = performance.now() - started;

      if (duration > 1500) {
        logger.logHttp(
          {
            method: req.method,
            url: req.url,
            durationMs: duration,
          },
          enableLogs,
        );
      }
    }),
  );
};
