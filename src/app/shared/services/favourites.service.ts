import { Injectable, signal } from '@angular/core';

const FAVORITES_KEY = 'favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private dataSignal = signal<string[]>(this.loadFromStorage());

  readonly favorites = this.dataSignal.asReadonly();

  toggleFavorite(name: string) {
    const current = this.dataSignal();
    const isFavorite = current.includes(name);

    const updated = isFavorite ? current.filter((el) => el !== name) : [...current, name];

    this.dataSignal.set(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }

  checkIsFavorite(name: string): boolean {
    return this.dataSignal().includes(name);
  }

  private loadFromStorage(): string[] {
    const rawData = localStorage.getItem(FAVORITES_KEY);
    return rawData ? JSON.parse(rawData) : [];
  }
}
