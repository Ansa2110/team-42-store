import {ChangeDetectionStrategy, Component, computed, inject, input,} from '@angular/core';
import {DecimalPipe, NgOptimizedImage, PercentPipe,} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favourites.service';
import { SnackBarService } from '../services/snackbar.service';

import { ProductType } from '@shared/types/product.types';

@Component({
  selector: 'app-product-card',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    PercentPipe,
    TranslatePipe,
  ],
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  private readonly cartService =
    inject(CartService);

  private readonly favoritesService =
    inject(FavoritesService);

  private readonly snackBarService =
    inject(SnackBarService);

  private readonly translateService =
    inject(TranslateService);

  readonly product =
    input.required<ProductType>();

  readonly isFavorite = computed(() =>
    this.favoritesService.checkIsFavorite(
      this.product().id,
    ),
  );

  readonly isInCart = computed(() =>
    this.cartService.checkIsInCart(
      this.product().id,
    ),
  );

  readonly discountedPrice = computed(() =>
    this.cartService.getDiscountedPrice(
      this.product(),
    ),
  );

  toggleFavorite(): void {
    const product = this.product();
    const wasFavorite = this.isFavorite();

    this.favoritesService.toggleFavorite(
      product,
    );

    const messageKey = wasFavorite
      ? 'productCard.messages.removedFromFavorites'
      : 'productCard.messages.addedToFavorites';

    this.snackBarService.success(
      this.translateService.instant(
        messageKey,
      ),
    );
  }

  addToCart(): void {
    this.cartService.addToCart(
      this.product(),
    );

    this.snackBarService.success(
      this.translateService.instant(
        'productCard.messages.addedToCart',
      ),
    );
  }
}
