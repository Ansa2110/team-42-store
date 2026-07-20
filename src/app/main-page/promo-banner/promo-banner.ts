import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-promo-banner',
  imports: [MatButtonModule, TranslatePipe],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.css',
})
export class PromoBanner {}
