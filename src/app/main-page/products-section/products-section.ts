import { Component, input, signal } from '@angular/core';
import { ProductCard } from '../../product-card/product-card';
import { products } from './constants';

@Component({
  selector: 'app-products-section',
  imports: [ProductCard],
  templateUrl: './products-section.html',
  styleUrl: './products-section.css',
})
export class ProductsSection {
  readonly sectionTitle = input<string>('');
  readonly viewAll = 'Смотреть все';

  readonly products = products;
}
