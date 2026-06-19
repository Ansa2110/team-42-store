import { Component, inject, signal } from '@angular/core';
import { CatalogFilters } from './catalog-filters/catalog-filters';
import { CatalogFiltersType } from './catalog-page.types';
import { ProductCard } from '@shared/product-card/product-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@services/products-api/products.service';
import { catchError, of } from 'rxjs';
import { SnackBarService } from '@shared/services/snackbar.service';
import { ICategory, IProduct } from '@services/products-api/products.types';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogFilters, ProductCard],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css',
})
export class CatalogPage {
  private productService = inject(ProductsService);
  private snackBar = inject(SnackBarService);

  readonly filters = signal<CatalogFiltersType>({
    page: 1,
    search: '',
    priceFrom: 0,
    priceTo: 500,
  });

  readonly products = toSignal(
    this.productService.getProducts().pipe(
      catchError((err) => {
        this.snackBar.error(err.error.message);
        return of({ products: [] as IProduct[] });
      }),
    ),
  );

  readonly categories = toSignal(
    this.productService.getAllCategories().pipe(
      catchError((err) => {
        this.snackBar.error(err.error.message);
        return of([] as ICategory[]);
      }),
    ),
  );

  // readonly productsByCategory = toSignal(
  //   this.productService.getProductsByCategory(this.category).pipe(
  //     catchError((err) => {
  //       this.snackBar.error(err.error.message);
  //       return of([] as string[]);
  //     }),
  //   ),
  // );

  updateFilters(newFields: Partial<CatalogFiltersType>) {
    this.filters.update((prev) => ({
      ...prev,
      ...newFields,
      page: 1,
    }));
  }
  // readonly total = computed(() => {
  //   const items = this.items();
  //   return items ? items.length : 0;
  // });
}
