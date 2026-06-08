import { Component, input, output } from '@angular/core';
import { CatalogFiltersType } from '../catalog-page.types';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListModule } from '@angular/material/list';
import { MatSlider, MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-catalog-filters',
  imports: [MatDivider, MatList, MatSlider, MatSliderModule, MatListModule],
  templateUrl: './catalog-filters.html',
  styleUrl: './catalog-filters.css',
})
export class CatalogFilters {
  readonly currentFilters = input.required<CatalogFiltersType>();

  readonly filtersChange = output<Partial<CatalogFiltersType>>();

  readonly categories = [{ title: 'aaa' }, { title: 'bbbb' }];

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
