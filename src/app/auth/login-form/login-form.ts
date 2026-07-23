import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import { AuthService } from '../auth.service';
import { AuthError } from '../auth.types';
import { GoogleAuthService } from '../google-auth.service';

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
    TranslatePipe,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  readonly registerClick = output<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly googleAuthService = inject(
    GoogleAuthService,
  );
  private readonly translate = inject(
    TranslateService,
  );

  readonly isSubmitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  get username() {
    return this.form.controls.username;
  }

  get password() {
    return this.form.controls.password;
  }

  get passwordInputType(): 'password' | 'text' {
    return this.passwordVisible()
      ? 'text'
      : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (value) => !value,
    );
  }

  async submit(): Promise<void> {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      await this.authService.login(
        this.form.getRawValue(),
      );

      await this.router.navigateByUrl('/main');
    } catch (error: unknown) {
      this.serverError.set(
        this.getErrorMessage(error),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.serverError.set(null);
    this.isSubmitting.set(true);

    try {
      const credential =
        await this.googleAuthService.requestCredential();

      this.authService.loginWithGoogleCredential(
        credential,
        this.form.controls.rememberMe.value,
      );

      await this.router.navigateByUrl('/main');
    } catch {
      this.serverError.set(
        this.translate.instant(
          'auth.login.errors.googleUnavailable',
        ),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  loginWithGithub(): void {
    this.serverError.set(
      this.translate.instant(
        'auth.login.errors.githubBackend',
      ),
    );
  }

  goToRegister(): void {
    this.registerClick.emit();
  }

  private getErrorMessage(
    error: unknown,
  ): string {
    if (error instanceof AuthError) {
      return this.translate.instant(
        `auth.errors.${error.code}`,
      );
    }

    return this.translate.instant(
      'auth.login.errors.loginFailed',
    );
  }
}
