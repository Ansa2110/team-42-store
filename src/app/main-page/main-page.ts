import { Component } from '@angular/core';
import { ProductsSection } from './products-section/products-section';
import { AdvantagesSection } from './advantages-section/advantages-section';

@Component({
  selector: 'app-main-page',
  imports: [ProductsSection, AdvantagesSection],
  templateUrl: './main-page.html',
})
export class MainPage {
  readonly recomendations = 'Рекомендации для вас';
}
