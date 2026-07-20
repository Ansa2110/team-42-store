import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  inject,
  signal,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'ru' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService =
    inject(TranslateService);

  private readonly document =
    inject(DOCUMENT);

  private readonly storageKey =
    'shopfront_language';

  readonly language = signal<AppLanguage>(
    this.getInitialLanguage(),
  );

  constructor() {
    this.translateService.addLangs([
      'ru',
      'en',
    ]);

    this.translateService.setFallbackLang(
      'ru',
    );

    this.setLanguage(this.language());
  }

  setLanguage(
    language: AppLanguage,
  ): void {
    this.language.set(language);

    localStorage.setItem(
      this.storageKey,
      language,
    );

    this.document.documentElement.lang =
      language;

    this.translateService.use(language);
  }

  toggleLanguage(): void {
    const nextLanguage: AppLanguage =
      this.language() === 'ru'
        ? 'en'
        : 'ru';

    this.setLanguage(nextLanguage);
  }

  private getInitialLanguage(): AppLanguage {
    const savedLanguage =
      localStorage.getItem(
        this.storageKey,
      );

    if (
      savedLanguage === 'ru' ||
      savedLanguage === 'en'
    ) {
      return savedLanguage;
    }

    return navigator.language
      .toLowerCase()
      .startsWith('ru')
      ? 'ru'
      : 'en';
  }
}
