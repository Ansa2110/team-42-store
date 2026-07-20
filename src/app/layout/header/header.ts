import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../auth/auth.service';
import { LanguageService } from '@services/language.service';
import { ThemeService } from '@services/theme.service';
import { PromoCountdownBanner } from './promo-countdown-banner/promo-countdown-banner';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    PromoCountdownBanner,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly authService = inject(AuthService);
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
  readonly profileMenuOpened = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (
      this.profileMenuOpened() &&
      target instanceof Node &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeProfileMenu();
  }

  async openCatalog(): Promise<void> {
    this.closeProfileMenu();
    await this.router.navigateByUrl('/catalog');
  }

  toggleProfileMenu(): void {
    this.profileMenuOpened.update((isOpened) => !isOpened);
  }

  closeProfileMenu(): void {
    this.profileMenuOpened.set(false);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
    this.closeProfileMenu();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.closeProfileMenu();
  }

  async logout(): Promise<void> {
    this.authService.logout();
    this.closeProfileMenu();

    await this.router.navigateByUrl('/main');
  }
}
