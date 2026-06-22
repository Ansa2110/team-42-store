import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from '../../../environments/environment.local';
import { AuthService } from '../auth.service';

import type { GoogleAuthResponse } from '../auth.types';

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleAuthResponse) => void;
      }) => void;
      prompt: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

@Component({
  selector: 'app-login-form',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  readonly registerClick = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private googleInitialized = false;

  readonly isSubmitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  get username() {
    return this.form.controls.username;
  }

  get password() {
    return this.form.controls.password;
  }

  get passwordInputType(): 'text' | 'password' {
    return this.passwordVisible() ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((value) => !value);
  }

  async submit(): Promise<void> {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { username, password } = this.form.getRawValue();

      await this.authService.login({ username, password });
      await this.router.navigateByUrl('/main');
    } catch (error) {
      this.serverError.set(error instanceof Error ? error.message : 'Не удалось войти в аккаунт');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.serverError.set(null);

    if (!environment.googleClientId) {
      this.serverError.set('Google authorization is not available');
      return;
    }

    try {
      await this.loadGoogleIdentityScript();

      if (!this.googleInitialized) {
        window.google?.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: async (response) => {
            if (!response.credential) {
              this.serverError.set('Google authorization failed');
              return;
            }

            this.authService.loginWithGoogleToken(response.credential);
            await this.router.navigateByUrl('/main');
          },
        });

        this.googleInitialized = true;
      }

      window.google?.accounts.id.prompt();
    } catch {
      this.serverError.set('Google authorization is not available');
    }
  }

  loginWithGithub(): void {
    this.serverError.set('GitHub authorization requires backend');
  }

  goToRegister(): void {
    this.registerClick.emit();
  }

  private loadGoogleIdentityScript(): Promise<void> {
    if (window.google?.accounts.id) {
      return Promise.resolve();
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(), { once: true });
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();

      document.head.appendChild(script);
    });
  }
}
