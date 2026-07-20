import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LanguageService } from '@services/language.service';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
}
