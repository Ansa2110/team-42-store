import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProductCard } from '@shared/product-card/product-card';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@services/products-api/products.service';
import { SnackBarService } from '@shared/services/snackbar.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { IProduct } from '@services/products-api/products.types';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products-section',
  imports: [ProductCard, RouterLink, TranslatePipe],
  templateUrl: './products-section.html',
  styleUrl: './products-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSection {
  private productService = inject(ProductsService);
  private snackBar = inject(SnackBarService);

  readonly sectionTitle = input<string>('');
  readonly viewAll = 'Смотреть все';

  readonly products = toSignal(
    this.productService.getProducts({ limit: 10 }).pipe(
      catchError((err) => {
        this.snackBar.error(err.error.message);
        return of({ products: [] as IProduct[] });
      }),
    ),
    { initialValue: { products: [] as IProduct[] } },
  );
}
