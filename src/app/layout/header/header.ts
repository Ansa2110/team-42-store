import { Component } from '@angular/core';
import { PromoCountdownBanner } from './promo-countdown-banner/promo-countdown-banner';

@Component({
  selector: 'app-header',
  imports: [PromoCountdownBanner],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  saleEndDate = new Date(Date.now() + 6 * 60 * 60 * 1000);

  onPromoClicked(): void {
    console.log('Promo banner clicked');
  }

  onPromoExpired(): void {
    console.log('Promo banner expired');
  }
  
}
