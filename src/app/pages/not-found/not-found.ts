import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './not-found.html',
})
export class NotFound {}
