import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '@shared/services/snackbar.service';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
  selector: 'app-subscribe-form',
  imports: [
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    LoadingButtonDirective,
  ],
  templateUrl: './subscribe-form.html',
  styleUrl: './subscribe-form.css',
})
export class SubscribeForm {
  private snackbar = inject(SnackBarService);
  readonly emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  readonly submitting = signal(false);

  handleSubscribe() {
    this.submitting.set(true);
    setTimeout(() => {
      if (!this.emailFormControl.errors) {
        this.snackbar.success('Успешно. Теперь вы будете получать самые свежие предложения!');
        this.emailFormControl.reset();
      } else {
        this.snackbar.error('Некорректный емаил');
      }
      this.submitting.set(false);
    }, 1000);
  }
}
