import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  error(message: string) {
    this.snackBar.open(message, undefined, {
      panelClass: 'error',
      duration: 10000,
    });
  }

  success(message: string) {
    this.snackBar.open(message, undefined, {
      panelClass: 'success',
      duration: 7000,
    });
  }
}
