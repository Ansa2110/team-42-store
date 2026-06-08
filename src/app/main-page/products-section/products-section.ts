import { Component, input } from '@angular/core';
import { ProductCard } from '../../shared/product-card/product-card';
import { products } from './constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-section',
  imports: [ProductCard, RouterLink],
  templateUrl: './products-section.html',
  styleUrl: './products-section.css',
})
export class ProductsSection {
  readonly sectionTitle = input<string>('');
  readonly viewAll = 'Смотреть все';

  readonly products = products;
}
