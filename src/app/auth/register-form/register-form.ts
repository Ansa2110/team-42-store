import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from '../../../environments/environment.local';
import { AuthService } from '../auth.service';
import { strongPasswordValidator } from '../auth.validators';

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
  selector: 'app-register-form',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  readonly loginClick = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private googleInitialized = false;

  readonly isSubmitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly passwordVisible = signal(false);
  readonly confirmPasswordVisible = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [this.passwordsMatchValidator],
    },
  );

  get name() {
    return this.form.controls.name;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  get passwordInputType(): 'text' | 'password' {
    return this.passwordVisible() ? 'text' : 'password';
  }

  get confirmPasswordInputType(): 'text' | 'password' {
    return this.confirmPasswordVisible() ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((value) => !value);
  }

  async submit(): Promise<void> {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { name, email, password } = this.form.getRawValue();

      await this.authService.register({ name, email, password });

      await this.authService.login({
        username: email,
        password,
      });

      await this.router.navigateByUrl('/main');
    } catch (error) {
      this.serverError.set(error instanceof Error ? error.message : 'Не удалось создать аккаунт');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async registerWithGoogle(): Promise<void> {
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

  registerWithGithub(): void {
    this.serverError.set('GitHub registration requires backend');
  }

  goToLogin(): void {
    this.loginClick.emit();
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordsMismatch: true };
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
