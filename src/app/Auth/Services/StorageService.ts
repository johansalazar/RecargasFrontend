import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private isBrowser: boolean = typeof window !== 'undefined';

  constructor() {}

  setItem(key: string, value: string) {
    if (this.isBrowser && localStorage) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isBrowser && localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string) {
    if (this.isBrowser && localStorage) {
      localStorage.removeItem(key);
    }
  }
}
