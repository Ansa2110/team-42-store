import {Injectable,computed,signal,
} from '@angular/core';

import { ProductType } from '@shared/types/product.types';

const FAVORITES_STORAGE_KEY = 'favorites';

@Injectable({providedIn: 'root',})
export class FavoritesService {
  private readonly favoritesSignal =
    signal<ProductType[]>(
      this.loadFromStorage(),
    );

  readonly favorites = this.favoritesSignal.asReadonly();

  readonly favoritesCount = computed(
    () => this.favoritesSignal().length,
  );

  readonly isEmpty = computed(
    () =>
      this.favoritesSignal().length === 0,
  );

  toggleFavorite(
    product: ProductType,
  ): void {
    if (
      this.checkIsFavorite(product.id)
    ) {
      this.removeFromFavorites(
        product.id,
      );

      return;
    }

    this.addToFavorites(product);
  }

  addToFavorites(
    product: ProductType,
  ): void {
    if (
      this.checkIsFavorite(product.id)
    ) {
      return;
    }

    this.setFavorites([
      ...this.favoritesSignal(),
      product,
    ]);
  }

  removeFromFavorites(
    productId: number,
  ): void {
    const updatedFavorites =
      this.favoritesSignal().filter(
        (product) =>
          product.id !== productId,
      );

    this.setFavorites(
      updatedFavorites,
    );
  }

  checkIsFavorite(
    productId: number,
  ): boolean {
    return this.favoritesSignal().some(
      (product) =>
        product.id === productId,
    );
  }

  clearFavorites(): void {
    this.setFavorites([]);
  }

  private setFavorites(
    favorites: ProductType[],
  ): void {
    this.favoritesSignal.set(
      favorites,
    );

    this.saveToStorage(favorites);
  }

  private saveToStorage(
    favorites: ProductType[],
  ): void {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites),
    );
  }

  private loadFromStorage(): ProductType[] {
    const rawData = localStorage.getItem(
      FAVORITES_STORAGE_KEY,
    );

    if (!rawData) {
      return [];
    }

    try {
      const parsedData: unknown =
        JSON.parse(rawData);

      if (!Array.isArray(parsedData)) {
        localStorage.removeItem(
          FAVORITES_STORAGE_KEY,
        );

        return [];
      }

      const favorites =
        parsedData.filter(
          (item): item is ProductType =>
            this.isStoredProduct(item),
        );

      if (
        favorites.length !==
        parsedData.length
      ) {
        this.saveToStorage(favorites);
      }

      return favorites;
    } catch {
      localStorage.removeItem(
        FAVORITES_STORAGE_KEY,
      );

      return [];
    }
  }

  private isStoredProduct(
    value: unknown,
  ): value is ProductType {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value['id'] === 'number' &&
      typeof value['title'] ===
      'string' &&
      typeof value['description'] ===
      'string' &&
      typeof value['category'] ===
      'string' &&
      typeof value['price'] ===
      'number' &&
      typeof value[
        'discountPercentage'
        ] === 'number' &&
      typeof value['rating'] ===
      'number' &&
      typeof value['stock'] ===
      'number' &&
      typeof value['thumbnail'] ===
      'string' &&
      Array.isArray(value['images'])
    );
  }

  private isRecord(
    value: unknown,
  ): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null
    );
  }
}
