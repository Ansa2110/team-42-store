import { Component, signal } from '@angular/core';

import { LoginForm, type LoginFormValue } from '../login-form/login-form';
import { RegisterForm, type RegisterFormValue } from '../register-form/register-form';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  protected readonly mode = signal<AuthMode>('login');

  protected showLogin(): void {
    this.mode.set('login');
  }

  protected showRegister(): void {
    this.mode.set('register');
  }

  protected handleLogin(value: LoginFormValue): void {
    console.log('Login submit:', value);
  }

  protected handleRegister(value: RegisterFormValue): void {
    console.log('Register submit:', value);
  }
}
