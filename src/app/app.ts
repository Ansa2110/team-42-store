import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthPage } from './auth/auth-page/auth-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AuthPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('team-42-store');
}
