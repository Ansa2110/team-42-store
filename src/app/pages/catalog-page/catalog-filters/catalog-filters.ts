import { Component, inject, input, output } from '@angular/core';
import { CatalogFiltersType } from '../catalog-page.types';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListModule } from '@angular/material/list';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@services/products-api/products.service';
import { SnackBarService } from '@shared/services/snackbar.service';
import { catchError, of } from 'rxjs';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-catalog-filters',
  imports: [MatDivider, MatList, MatSlider, MatSliderModule, MatListModule,TranslatePipe],
  templateUrl: './catalog-filters.html',
  styleUrl: './catalog-filters.css',
})
export class CatalogFilters {
  private productService = inject(ProductsService);
  private snackBar = inject(SnackBarService);

  readonly currentFilters = input.required<CatalogFiltersType>();

  readonly filtersChange = output<Partial<CatalogFiltersType>>();

  readonly categoriesList = toSignal(
    this.productService.getProductsCategoryList().pipe(
      catchError((err) => {
        this.snackBar.error(err.error.message);
        return of([] as string[]);
      }),
    ),
  );
  selectCategory(categoryTitle: string) {
    this.filtersChange.emit({ category: categoryTitle });
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtersChange.emit({ search: inputElement.value });
  }

  onPriceRangeChange(event: Event, value: keyof CatalogFiltersType) {
    const inputElement = event.target as HTMLInputElement;
    this.filtersChange.emit({ [value]: inputElement.value });
  }

  set<K extends keyof CatalogFiltersType>(key: K, value: CatalogFiltersType[K]) {
    this.filtersChange.emit({ [key]: value });
  }
}
