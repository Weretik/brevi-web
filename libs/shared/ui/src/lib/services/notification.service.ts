import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type NotifyOpts = {
  lifeMs?: number;
  sticky?: boolean;
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);
  success(summary: string, detail?: string, opts: NotifyOpts = {}): void {
    this.messages.add({
      severity: 'success',
      summary,
      detail,
      life: opts.lifeMs ?? 2500,
      sticky: opts.sticky ?? false,
    });
  }

  warn(summary: string, detail?: string, opts: NotifyOpts = {}): void {
    this.messages.add({
      severity: 'warn',
      summary,
      detail,
      life: opts.lifeMs ?? 3500,
      sticky: opts.sticky ?? false,
    });
  }

  error(summary: string, detail?: string, opts: NotifyOpts = {}): void {
    this.messages.add({
      severity: 'error',
      summary,
      detail,
      life: opts.lifeMs ?? 5000,
      sticky: opts.sticky ?? false,
    });
  }

  info(summary: string, detail?: string, opts: NotifyOpts = {}) {
    this.messages.add({
      severity: 'info',
      summary,
      detail,
      life: opts.lifeMs ?? 3000,
      sticky: opts.sticky ?? false,
    });
  }

  clear(): void {
    this.messages.clear();
  }
}
