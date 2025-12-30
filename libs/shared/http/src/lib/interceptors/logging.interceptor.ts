import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppLogger } from '@shared/logging';
import { finalize, tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(AppLogger);
  const started = performance.now();

  return next(req).pipe(
    tap({
      error: (error) => {
        logger.logError({
          method: req.method,
          url: req.url,
          durationMs: performance.now() - started,
          error,
        });
      },
    }),
    finalize(() => {
      const duration = performance.now() - started;

      if (duration > 1500) {
        logger.logHttp({
          method: req.method,
          url: req.url,
          durationMs: duration,
        });
      }
    }),
  );
};
