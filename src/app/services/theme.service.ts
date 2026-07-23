import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly storageKey =
    'shopfront_theme';

  readonly theme = signal<AppTheme>(
    this.getInitialTheme(),
  );

  readonly isDark = computed(
    () => this.theme() === 'dark',
  );

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: AppTheme =
      this.theme() === 'light'
        ? 'dark'
        : 'light';

    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);

    localStorage.setItem(
      this.storageKey,
      theme,
    );

    this.applyTheme(theme);
  }

  private getInitialTheme(): AppTheme {
    const savedTheme = localStorage.getItem(
      this.storageKey,
    );

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark'
    ) {
      return savedTheme;
    }

    const systemPrefersDark =
      window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;

    return systemPrefersDark
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: AppTheme): void {
    const html =
      this.document.documentElement;

    html.dataset['theme'] = theme;
    html.style.colorScheme = theme;
  }
}
