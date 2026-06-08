import {
  Component,
  EventEmitter,
  Output,
  inject,
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

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Output() readonly registerClick = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly passwordVisible = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  get email() {
    return this.form.controls.email;
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
      const { email, password } = this.form.getRawValue();

      await this.authService.login({
        email,
        password,
      });

      await this.router.navigateByUrl('/main');
    } catch (error) {
      this.serverError.set(
        error instanceof Error
          ? error.message
          : 'Не удалось войти в аккаунт',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goToRegister(): void {
    this.registerClick.emit();
  }
}
