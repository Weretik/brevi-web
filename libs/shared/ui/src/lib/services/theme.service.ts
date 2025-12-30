import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

type ThemeValue = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorageService);

  private readonly DARK_CLASS = 'my-app-dark';
  private readonly THEME_KEY = 'theme';

  private readonly _isDark = signal(false);
  public readonly isDark = this._isDark.asReadonly();

  public init(): void {
    const isDark = this.storage.getItem(this.THEME_KEY) === 'dark';
    this.apply(isDark);
    this._isDark.set(isDark);
  }

  public getTheme(): boolean {
    return this.storage.getItem(this.THEME_KEY) === 'dark';
  }

  public setTheme(isDark: boolean): void {
    const value: ThemeValue = isDark ? 'dark' : 'light';
    this.storage.setItem(this.THEME_KEY, value);
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
