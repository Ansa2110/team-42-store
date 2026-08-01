import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductCard } from '@shared/product-card/product-card';
import { FavoritesService } from '@shared/services/favourites.service';

@Component({
  selector: 'app-favorites-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    ProductCard,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './favorites-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
  readonly favoritesService = inject(
    FavoritesService,
  );
}
