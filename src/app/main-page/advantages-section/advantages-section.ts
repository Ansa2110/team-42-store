import { Component } from '@angular/core';
import { advantages } from './advantages-card/constants';
import { AdvantagesCard } from './advantages-card/advantages-card';

@Component({
  selector: 'app-advantages-section',
  imports: [AdvantagesCard],
  templateUrl: './advantages-section.html',
  styleUrl: './advantages-section.css',
})
export class AdvantagesSection {
  readonly advantages = advantages;
}
