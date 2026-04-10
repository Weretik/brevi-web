import { inject, Injectable } from '@angular/core';

import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly notification = inject(NotificationService);

  async copy(value: string, successMessage = 'Скопійовано'): Promise<boolean> {
    const text = value?.trim();
    if (!text) {
      return false;
    }

    try {
      const clipboard = globalThis.navigator?.clipboard;
      if (!clipboard?.writeText) {
        throw new Error('Clipboard is unavailable');
      }
      await clipboard.writeText(text);

      this.notification.success(successMessage);
      return true;
    } catch {
      this.notification.warn('Не вдалося скопіювати');
      return false;
    }
  }
}
