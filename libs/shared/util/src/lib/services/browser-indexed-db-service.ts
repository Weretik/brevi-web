import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserIndexedDbService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly dbName = 'brevi-web-db';
  private readonly dbVersion = 1;
  private readonly storeName = 'kv';

  private dbPromise: Promise<IDBDatabase> | null = null;

  async getItem<T>(key: IDBValidKey): Promise<T | null> {
    if (!this.isBrowser) return null;

    const db = await this.openDb();
    return new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const request = tx.objectStore(this.storeName).get(key);

      request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async setItem<T>(key: IDBValidKey, value: T): Promise<void> {
    if (!this.isBrowser) return;

    const db = await this.openDb();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const request = tx.objectStore(this.storeName).put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeItem(key: IDBValidKey): Promise<void> {
    if (!this.isBrowser) return;

    const db = await this.openDb();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const request = tx.objectStore(this.storeName).delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.isBrowser) return;

    const db = await this.openDb();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const request = tx.objectStore(this.storeName).clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private openDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }
}
