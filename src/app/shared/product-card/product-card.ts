import { Component, inject, input, computed } from '@angular/core';
import { FavoritesService } from '../services/favourites.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule],
  templateUrl: './product-card.html',
})
export class ProductCard {
  private favorites = inject(FavoritesService);

  readonly title = input.required<string>();
  readonly rating = input.required<number>();
  readonly price = input.required<number>();
  readonly imgSrc = input<string>('');

  readonly isFavorite = computed(() => this.favorites.checkIsFavorite(this.title()));

  toggleItem() {
    this.favorites.toggleFavorite(this.title());
  }
}
