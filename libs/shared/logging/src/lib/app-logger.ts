import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { APP_LOGGING_CONFIG } from './logging.tokens';

export interface HttpLogEntry {
  method: string;
  url: string;
  status?: number;
  durationMs: number;
  error?: unknown;
}

@Injectable({ providedIn: 'root' })
export class AppLogger {
  private readonly config = inject(APP_LOGGING_CONFIG);
  private readonly platformId = inject(PLATFORM_ID);

  logHttp(entry: HttpLogEntry, toConsole = true): void {
    if (toConsole) {
      console.warn('[HTTP]', entry);
    }
  }

  logError(entry: HttpLogEntry, toConsole = true): void {
    if (toConsole) {
      console.error('[HTTP ERROR]', entry);
    }

    this.sendRemote({
      type: 'http_error',
      payload: {
        method: entry.method,
        url: entry.url,
        status: entry.status,
        durationMs: Math.round(entry.durationMs),
        error: this.normalizeError(entry.error),
      },
    });
  }

  logClientError(error: unknown): void {
    this.sendRemote({
      type: 'client_error',
      payload: this.normalizeError(error),
    });
  }

  private sendRemote(event: { type: string; payload: unknown }): void {
    if (!this.config.enabled || !this.config.endpoint) {
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const body = JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
      app: this.config.appName,
      version: this.config.appVersion,
      env: this.config.environment,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
    const endpoint = this.config.endpoint;

    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const sent = navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
        if (sent) return;
      }

      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body,
      });
    } catch {
      // avoid throwing from logger
    }
  }

  private normalizeError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (error && typeof error === 'object') {
      const data = error as Record<string, unknown>;
      return {
        message: typeof data['message'] === 'string' ? data['message'] : String(error),
        name: typeof data['name'] === 'string' ? data['name'] : 'UnknownError',
        stack: typeof data['stack'] === 'string' ? data['stack'] : undefined,
      };
    }

    return {
      name: 'UnknownError',
      message: String(error ?? 'unknown'),
    };
  }
}
