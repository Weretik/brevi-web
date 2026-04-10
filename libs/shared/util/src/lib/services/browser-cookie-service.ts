import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

export interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

@Injectable({
  providedIn: 'root',
})
export class BrowserCookieService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  get(name: string): string | null {
    if (!this.isBrowser) return null;

    const encodedName = encodeURIComponent(name);
    const parts = document.cookie ? document.cookie.split('; ') : [];

    for (const part of parts) {
      const separatorIndex = part.indexOf('=');
      const rawName = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
      if (rawName !== encodedName) continue;

      const rawValue = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : '';
      return decodeURIComponent(rawValue);
    }

    return null;
  }

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (!this.isBrowser) return;

    const segments: string[] = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      `Path=${options.path ?? '/'}`,
    ];

    if (typeof options.expires === 'number') {
      const expiresDate = new Date(Date.now() + options.expires * 86400000);
      segments.push(`Expires=${expiresDate.toUTCString()}`);
    } else if (options.expires instanceof Date) {
      segments.push(`Expires=${options.expires.toUTCString()}`);
    }

    if (options.domain) segments.push(`Domain=${options.domain}`);
    if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);
    if (options.secure) segments.push('Secure');

    document.cookie = segments.join('; ');
  }

  remove(name: string, options: Omit<CookieOptions, 'expires'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
    });
  }
}
