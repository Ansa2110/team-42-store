import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AdvantagesSection } from './advantages-section/advantages-section';
import { CategoriesSection } from './categories-section/categories-section';
import { ProductsSection } from './products-section/products-section';
import { PromoBanner } from './promo-banner/promo-banner';
import { SubscribeForm } from './subscribe-form/subscribe-form';

@Component({
  selector: 'app-main-page',
  imports: [
    TranslatePipe,
    ProductsSection,
    CategoriesSection,
    AdvantagesSection,
    PromoBanner,
    SubscribeForm,
  ],
  templateUrl: './main-page.html',
})
export class MainPage {}
