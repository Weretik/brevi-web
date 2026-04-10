import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserSessionStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  getItem(key: string): string | null {
    if (!this.isBrowser) return null;
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser) return;
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    sessionStorage.removeItem(key);
  }
}
