import { Component, computed, signal } from '@angular/core';
import { CatalogFilters } from './catalog-filters/catalog-filters';
import { CatalogFiltersType, ProductType } from './catalog-page.types';
import { ProductCard } from '../shared/product-card/product-card';

@Component({
  selector: 'app-catalog-page',
  imports: [CatalogFilters, ProductCard],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css',
})
export class CatalogPage {
  readonly filters = signal<CatalogFiltersType>({
    page: 1,
    search: '',
    priceFrom: 0,
    priceTo: 500,
  });

  readonly items = signal<ProductType[] | null>(null);

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
