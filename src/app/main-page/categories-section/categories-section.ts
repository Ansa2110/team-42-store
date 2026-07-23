import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@services/products-api/products.service';
import { SnackBarService } from '@shared/services/snackbar.service';
import { catchError, of } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesSection {
  private productService = inject(ProductsService);
  private snackBar = inject(SnackBarService);

  readonly sectionTitle = input<string>('');
  readonly viewAll = 'Смотреть все';

  readonly categories = toSignal(
    this.productService.getAllCategories().pipe(
      catchError((err) => {
        this.snackBar.error(err.error.message);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  //add api call
}
