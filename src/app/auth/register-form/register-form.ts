import {
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
} from '@angular/core';
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

import { AuthService } from '../auth.service';
import { strongPasswordValidator } from '../auth.validators';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  @Output() readonly loginClick = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

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

      await this.authService.register({
        name,
        email,
        password,
      });

      await this.router.navigateByUrl('/main');
    } catch (error) {
      this.serverError.set(
        error instanceof Error
          ? error.message
          : 'Не удалось создать аккаунт',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goToLogin(): void {
    this.loginClick.emit();
  }

  private passwordsMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : {
        passwordsMismatch: true,
      };
  }
}
