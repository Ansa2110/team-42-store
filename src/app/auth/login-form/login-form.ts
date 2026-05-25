import { Component, OnDestroy, OnInit, input, output, signal } from '@angular/core';

export interface LoginFormValue {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-login-form',
  imports: [],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm implements OnInit, OnDestroy {
  title = input('Вход в аккаунт');
  subtitle = input('Введите свои данные для входа');

  formSubmit = output<LoginFormValue>();
  registerClick = output<void>();

  protected readonly errors = signal<LoginFormErrors>({});
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    console.log('LoginForm initialized');
  }

  ngOnDestroy(): void {
    console.log('LoginForm destroyed');
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const value: LoginFormValue = {
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    };

    const errors = this.validate(value);
    this.errors.set(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    this.isSubmitting.set(true);
    this.formSubmit.emit(value);

    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }

  protected onRegisterClick(): void {
    this.registerClick.emit();
  }

  private validate(value: LoginFormValue): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (!value.email) {
      errors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
      errors.email = 'Введите корректный email';
    }

    if (!value.password) {
      errors.password = 'Введите пароль';
    }

    return errors;
  }
}
