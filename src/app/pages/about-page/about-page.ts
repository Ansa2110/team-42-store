import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface AboutStat {
  icon: string;
  key: 'customers' | 'delivery' | 'products' | 'support';
}

interface Developer {
  github: string;
  initials: string;
  memberKey: 'angelina' | 'ansar' | 'viktoryia';
  roleKey: 'teamLead' | 'teamMember';
}

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './about-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  readonly stats: readonly AboutStat[] = [
    {
      icon: 'group',
      key: 'customers',
    },
    {
      icon: 'inventory_2',
      key: 'products',
    },
    {
      icon: 'local_shipping',
      key: 'delivery',
    },
    {
      icon: 'support_agent',
      key: 'support',
    },
  ];

  readonly developers: readonly Developer[] = [
    {
      github: 'https://github.com/Ansa2110',
      initials: 'A',
      memberKey: 'ansar',
      roleKey: 'teamLead',
    },
    {
      github: 'https://github.com/viktorykings',
      initials: 'V',
      memberKey: 'viktoryia',
      roleKey: 'teamMember',
    },
    {
      github: 'https://github.com/angelinavakkasova',
      initials: 'A',
      memberKey: 'angelina',
      roleKey: 'teamMember',
    },
  ];
}
