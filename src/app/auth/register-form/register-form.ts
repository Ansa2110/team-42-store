import { Component, OnDestroy, OnInit, input, output, signal } from '@angular/core';

export interface RegisterFormValue {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-register-form',
  imports: [],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm implements OnInit, OnDestroy {
  title = input('Создайте аккаунт');
  subtitle = input('Зарегистрируйтесь, чтобы начать покупки');

  formSubmit = output<RegisterFormValue>();
  loginClick = output<void>();

  protected readonly errors = signal<RegisterFormErrors>({});
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    console.log('RegisterForm initialized');
  }

  ngOnDestroy(): void {
    console.log('RegisterForm destroyed');
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const value: RegisterFormValue = {
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
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

  protected onLoginClick(): void {
    this.loginClick.emit();
  }

  private validate(value: RegisterFormValue): RegisterFormErrors {
    const errors: RegisterFormErrors = {};

    if (!value.firstName) errors.firstName = 'Введите имя';

    if (!value.email) {
      errors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
      errors.email = 'Введите корректный email';
    }

    if (!value.password) {
      errors.password = 'Введите пароль';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value.password)) {
      errors.password = 'Пароль должен содержать минимум 8 символов, буквы и цифры';
    }

    return errors;
  }
}
