import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AboutStat {
  icon: string;
  title: string;
  text: string;
}

interface Developer {
  name: string;
  role: string;
  text: string;
  github: string;
  initials: string;
}

@Component({
  selector: 'app-about-page',
  imports: [RouterLink],
  templateUrl: './about-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  readonly stats: readonly AboutStat[] = [
    {
      icon: 'group',
      title: '5000+',
      text: 'happy customers',
    },
    {
      icon: 'inventory_2',
      title: '50 000+',
      text: 'products in catalog',
    },
    {
      icon: 'local_shipping',
      title: 'Fast delivery',
      text: 'across Kazakhstan',
    },
    {
      icon: 'support_agent',
      title: '24/7 support',
      text: 'we are always nearby',
    },
  ];

  readonly developers: readonly Developer[] = [
    {
      name: 'Ansar',
      role: 'Team Lead',
      text: 'Coordinates the team, product decisions, and the overall development process.',
      github: 'https://github.com/Ansa2110',
      initials: 'A',
    },
    {
      name: 'Viktoryia',
      role: 'Team Member',
      text: 'Works on interface details and helps make the shopping flow clear and pleasant.',
      github: 'https://github.com/viktorykings',
      initials: 'V',
    },
    {
      name: 'Angelina',
      role: 'Team Member',
      text: 'Builds user-facing features and supports a polished customer experience.',
      github: 'https://github.com/angelinavakkasova',
      initials: 'A',
    },
  ];
}
