import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly title = input.required<string>();
  readonly rating = input.required<number>();
  readonly price = input.required<number>();
  readonly imgSrc = input<string>('');
}
