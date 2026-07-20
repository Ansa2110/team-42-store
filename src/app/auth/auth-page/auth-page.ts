import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../auth.service';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  imports: [
    LoginForm,
    RegisterForm,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
  changeDetection:
  ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
  private readonly router =
    inject(Router);

  private readonly authService =
    inject(AuthService);

  readonly mode =
    signal<AuthMode>('login');

  constructor() {
    if (
      this.authService.isAuthenticated()
    ) {
      void this.router.navigateByUrl(
        '/main',
      );
    }
  }

  showLogin(): void {
    this.mode.set('login');
  }

  showRegister(): void {
    this.mode.set('register');
  }
}
