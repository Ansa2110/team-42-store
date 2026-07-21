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
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import { AuthService } from '../auth.service';
import { AuthError } from '../auth.types';
import {
  passwordsMatchValidator,
  strongPasswordValidator,
} from '../auth.validators';
import { GoogleAuthService } from '../google-auth.service';

import type {
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';

class PasswordMatchErrorStateMatcher
  implements ErrorStateMatcher
{
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const interacted =
      Boolean(control?.touched) ||
      Boolean(form?.submitted);

    const hasControlError =
      Boolean(control?.invalid);

    const hasPasswordsMismatch =
      Boolean(
        control?.parent?.hasError(
          'passwordsMismatch',
        ),
      );

    return (
      interacted &&
      (
        hasControlError ||
        hasPasswordsMismatch
      )
    );
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
    TranslatePipe,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  readonly loginClick = output<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly googleAuthService = inject(
    GoogleAuthService,
  );
  private readonly translate = inject(
    TranslateService,
  );

  readonly passwordMatchErrorStateMatcher =
    new PasswordMatchErrorStateMatcher();

  readonly isSubmitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly passwordVisible = signal(false);
  readonly confirmPasswordVisible = signal(false);

  readonly form = this.formBuilder.nonNullable.group(
    {
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          strongPasswordValidator(),
        ],
      ],
      confirmPassword: [
        '',
        Validators.required,
      ],
    },
    {
      validators: passwordsMatchValidator,
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

  get passwordInputType(): 'password' | 'text' {
    return this.passwordVisible()
      ? 'text'
      : 'password';
  }

  get confirmPasswordInputType():
    | 'password'
    | 'text' {
    return this.confirmPasswordVisible()
      ? 'text'
      : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (value) => !value,
    );
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update(
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
      const { name, email, password } =
        this.form.getRawValue();

      await this.authService.register({
        name,
        email,
        password,
      });

      await this.authService.login({
        username: email,
        password,
        rememberMe: true,
      });

      await this.router.navigateByUrl('/main');
    } catch (error: unknown) {
      this.serverError.set(
        this.getErrorMessage(error),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async registerWithGoogle(): Promise<void> {
    this.serverError.set(null);
    this.isSubmitting.set(true);

    try {
      const credential =
        await this.googleAuthService.requestCredential();

      this.authService.loginWithGoogleCredential(
        credential,
      );

      await this.router.navigateByUrl('/main');
    } catch {
      this.serverError.set(
        this.translate.instant(
          'auth.register.errors.googleUnavailable',
        ),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  registerWithGithub(): void {
    this.serverError.set(
      this.translate.instant(
        'auth.register.errors.githubBackend',
      ),
    );
  }

  goToLogin(): void {
    this.loginClick.emit();
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
      'auth.register.errors.registerFailed',
    );
  }
}
