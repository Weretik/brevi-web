import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly DARK_CLASS = 'my-app-dark';

  getTheme(): boolean {
    if (!this.isBrowser) return false;

    return localStorage.getItem('theme') === 'dark';
  }

  setTheme(isDark: boolean): void {
    if (!this.isBrowser) return;

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    this.document.documentElement.classList.toggle(this.DARK_CLASS, isDark);
  }
}
