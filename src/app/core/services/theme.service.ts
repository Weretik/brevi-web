import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly DARK_CLASS = 'my-app-dark';

  private readonly _isDark = signal(false);
  readonly isDark = this._isDark.asReadonly();

  public init(): void {
    if (!this.isBrowser) return;

    const isDark = localStorage.getItem('theme') === 'dark';
    this.apply(isDark);
    this._isDark.set(isDark);
  }

  public getTheme(): boolean {
    if (!this.isBrowser) return false;

    return localStorage.getItem('theme') === 'dark';
  }

  public setTheme(isDark: boolean): void {
    if (!this.isBrowser) return;

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.apply(isDark);
    this._isDark.set(isDark);
  }

  public toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  private apply(isDark: boolean): void {
    this.document.documentElement.classList.toggle(this.DARK_CLASS, isDark);
  }
}
