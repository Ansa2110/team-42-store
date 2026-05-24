import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-advantages-card',
  imports: [MatIconModule],
  templateUrl: './advantages-card.html',
})
export class AdvantagesCard {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly iconName = input.required<string>();
}
