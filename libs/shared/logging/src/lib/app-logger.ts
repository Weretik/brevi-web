import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface HttpLogEntry {
  method: string;
  url: string;
  status?: number;
  durationMs: number;
  error?: unknown;
}

@Injectable({ providedIn: 'root' })
export class AppLogger {
  logHttp(entry: HttpLogEntry): void {
    if (!environment.enableHttpLogs) return;

    console.warn('[HTTP]', entry);
  }

  logError(entry: HttpLogEntry): void {
    console.error('[HTTP ERROR]', entry);
  }
}
