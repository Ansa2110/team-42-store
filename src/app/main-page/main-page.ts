import { Component } from '@angular/core';
import { ProductsSection } from './products-section/products-section';
import { AdvantagesSection } from './advantages-section/advantages-section';
import { PromoBanner } from './promo-banner/promo-banner';
import { SubscribeForm } from './subscribe-form/subscribe-form';
import { CategoriesSection } from './categories-section/categories-section';

@Component({
  selector: 'app-main-page',
  imports: [ProductsSection, CategoriesSection, AdvantagesSection, PromoBanner, SubscribeForm],
  templateUrl: './main-page.html',
})
export class MainPage {
  readonly recomendations = 'Рекомендации для вас';
  readonly categories = 'Популярные категории';
}
