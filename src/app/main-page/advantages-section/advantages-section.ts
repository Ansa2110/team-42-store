import {ChangeDetectionStrategy, Component, } from '@angular/core';
import { advantages } from './advantages-card/constants';
import { AdvantagesCard } from './advantages-card/advantages-card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-advantages-section',
  imports: [AdvantagesCard, TranslatePipe],
  templateUrl: './advantages-section.html',
  styleUrl: './advantages-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvantagesSection {
  readonly advantages = advantages;
}
