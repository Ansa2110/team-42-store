import {
  Injectable,
  computed,
  signal,
} from '@angular/core';

import { ProductType } from '@shared/types/product.types';

const CART_STORAGE_KEY = 'shopfront_cart';

export interface CartItem {
  productData: ProductType;
  quantity: number;
}

interface StoredCartItem {
  productData?: unknown;
  product?: unknown;
  quantity?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItemsSignal =
    signal<CartItem[]>(
      this.loadFromStorage(),
    );

  readonly items =
    this.cartItemsSignal.asReadonly();

  readonly totalQuantity = computed(() =>
    this.cartItemsSignal().reduce(
      (total, cartItem) =>
        total + cartItem.quantity,
      0,
    ),
  );

  readonly totalPrice = computed(() =>
    this.cartItemsSignal().reduce(
      (total, cartItem) =>
        total +
        this.getDiscountedPrice(
          cartItem.productData,
        ) *
        cartItem.quantity,
      0,
    ),
  );

  readonly isEmpty = computed(
    () =>
      this.cartItemsSignal().length === 0,
  );

  addToCart(productData: ProductType): void {
    const currentItems =
      this.cartItemsSignal();

    const existingItem = currentItems.find(
      (cartItem) =>
        cartItem.productData.id ===
        productData.id,
    );

    if (existingItem) {
      this.updateQuantity(
        productData.id,
        existingItem.quantity + 1,
      );

      return;
    }

    this.setItems([
      ...currentItems,
      {
        productData,
        quantity: 1,
      },
    ]);
  }

  removeFromCart(productId: number): void {
    const updatedItems =
      this.cartItemsSignal().filter(
        (cartItem) =>
          cartItem.productData.id !==
          productId,
      );

    this.setItems(updatedItems);
  }

  increaseQuantity(
    productId: number,
  ): void {
    const cartItem =
      this.cartItemsSignal().find(
        (item) =>
          item.productData.id === productId,
      );

    if (!cartItem) {
      return;
    }

    this.updateQuantity(
      productId,
      cartItem.quantity + 1,
    );
  }

  decreaseQuantity(
    productId: number,
  ): void {
    const cartItem =
      this.cartItemsSignal().find(
        (item) =>
          item.productData.id === productId,
      );

    if (!cartItem) {
      return;
    }

    if (cartItem.quantity <= 1) {
      this.removeFromCart(productId);

      return;
    }

    this.updateQuantity(
      productId,
      cartItem.quantity - 1,
    );
  }

  updateQuantity(
    productId: number,
    quantity: number,
  ): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);

      return;
    }

    const updatedItems =
      this.cartItemsSignal().map(
        (cartItem) =>
          cartItem.productData.id ===
          productId
            ? {
              ...cartItem,
              quantity,
            }
            : cartItem,
      );

    this.setItems(updatedItems);
  }

  clearCart(): void {
    this.setItems([]);
  }

  checkIsInCart(
    productId: number,
  ): boolean {
    return this.cartItemsSignal().some(
      (cartItem) =>
        cartItem.productData.id ===
        productId,
    );
  }

  getDiscountedPrice(
    productData: ProductType,
  ): number {
    const discount =
      (productData.price *
        productData.discountPercentage) /
      100;

    return productData.price - discount;
  }

  private setItems(
    items: CartItem[],
  ): void {
    this.cartItemsSignal.set(items);
    this.saveToStorage(items);
  }

  private saveToStorage(
    items: CartItem[],
  ): void {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );
  }

  private loadFromStorage(): CartItem[] {
    const rawData = localStorage.getItem(
      CART_STORAGE_KEY,
    );

    if (!rawData) {
      return [];
    }

    try {
      const parsedData: unknown =
        JSON.parse(rawData);

      if (!Array.isArray(parsedData)) {
        localStorage.removeItem(
          CART_STORAGE_KEY,
        );

        return [];
      }

      const items = parsedData
        .map((value) =>
          this.parseStoredCartItem(value),
        )
        .filter(
          (value): value is CartItem =>
            value !== null,
        );

      this.saveToStorage(items);

      return items;
    } catch {
      localStorage.removeItem(
        CART_STORAGE_KEY,
      );

      return [];
    }
  }

  private parseStoredCartItem(
    value: unknown,
  ): CartItem | null {
    if (this.isRecord(value)) {
      const storedItem =
        value as StoredCartItem;

      const productData =
        storedItem.productData ??
        storedItem.product;

      const quantity =
        storedItem.quantity;

      if (
        this.isStoredProduct(productData) &&
        this.isValidQuantity(quantity)
      ) {
        return {
          productData,
          quantity,
        };
      }
    }

    return null;
  }

  private isValidQuantity(
    value: unknown,
  ): value is number {
    return (
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value > 0
    );
  }

  private isStoredProduct(
    value: unknown,
  ): value is ProductType {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value['id'] === 'number' &&
      typeof value['title'] === 'string' &&
      typeof value['price'] === 'number' &&
      typeof value[
        'discountPercentage'
        ] === 'number'
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
