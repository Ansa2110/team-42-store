import { Component, inject, input, computed } from '@angular/core';
import { FavoritesService } from '../services/favourites.service';
import { MatIconModule } from '@angular/material/icon';
import { PercentPipe, DecimalPipe } from '@angular/common';
import { ProductType } from '@shared/types/product.types';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule, PercentPipe, DecimalPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  private favorites = inject(FavoritesService);

  readonly product = input.required<ProductType>({});

  readonly isFavorite = computed(() => this.favorites.checkIsFavorite(this.product().title));

  toggleItem() {
    this.favorites.toggleFavorite(this.product().title);
  }
}
