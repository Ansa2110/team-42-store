import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  DecimalPipe,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import {
  CartItem,
  CartService,
} from '@shared/services/cart.service';
import { SnackBarService } from '@shared/services/snackbar.service';

@Component({
  selector: 'app-cart-page',
  imports: [
    DecimalPipe,
    NgOptimizedImage,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './cart-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  private readonly cartService =
    inject(CartService);

  private readonly snackBarService =
    inject(SnackBarService);

  private readonly translateService =
    inject(TranslateService);

  readonly items = this.cartService.items;

  readonly totalQuantity =
    this.cartService.totalQuantity;

  readonly totalPrice =
    this.cartService.totalPrice;

  readonly isEmpty =
    this.cartService.isEmpty;

  increaseQuantity(
    productId: number,
  ): void {
    this.cartService.increaseQuantity(
      productId,
    );
  }

  decreaseQuantity(
    productId: number,
  ): void {
    this.cartService.decreaseQuantity(
      productId,
    );
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(
      productId,
    );
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getDiscountedPrice(
    cartItem: CartItem,
  ): number {
    return this.cartService.getDiscountedPrice(
      cartItem.productData,
    );
  }

  getItemTotal(cartItem: CartItem): number {
    return (
      this.getDiscountedPrice(cartItem) *
      cartItem.quantity
    );
  }

  placeOrder(): void {
    this.snackBarService.success(
      this.translateService.instant(
        'cart.messages.orderUnavailable',
      ),
    );
  }
}
