import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '@shared/services/snackbar.service';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';


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
    TranslatePipe,
  ],
  templateUrl: './subscribe-form.html',
  styleUrl: './subscribe-form.css',
})
export class SubscribeForm {
  private snackbar = inject(SnackBarService);
  readonly emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  readonly submitting = signal(false);
  private readonly translate = inject(TranslateService);

  handleSubscribe(): void {
    if (this.emailFormControl.invalid) {
      this.emailFormControl.markAsTouched();
      this.snackbar.error(
        this.translate.instant('main.subscribe.messages.error'),
      );
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      this.snackbar.success(
        this.translate.instant('main.subscribe.messages.success'),
      );
      this.emailFormControl.reset();
      this.submitting.set(false);
    }, 1000);
  }
}
