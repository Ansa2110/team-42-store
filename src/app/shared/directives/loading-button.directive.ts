import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[appLoadingButton]',
})
export class LoadingButtonDirective {
  readonly appLoadingButton = input(false);

  @HostBinding('class.loading-button')
  @HostBinding('class.mat-button-disabled')
  @HostBinding('disabled')
  get loading(): boolean {
    return this.appLoadingButton();
  }
}
