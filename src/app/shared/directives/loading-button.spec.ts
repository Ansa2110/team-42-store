import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoadingButtonDirective } from './loading-button.directive';

@Component({
  imports: [LoadingButtonDirective],
  template: ` <button [appLoadingButton]="loading()">Save</button> `,
})
class TestHostComponent {
  loading = signal(false);
}

describe('LoadingButtonDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  });

  it('should create directive', () => {
    const directive = fixture.debugElement.query(By.directive(LoadingButtonDirective));

    expect(directive).toBeTruthy();
  });

  it('should not apply classes and disabled by default', () => {
    expect(button.disabled).toBe(false);
    expect(button.classList.contains('loading-button')).toBe(false);
    expect(button.classList.contains('mat-button-disabled')).toBe(false);
  });

  it('should apply classes and disabled when loading is true', () => {
    component.loading.set(true);
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('loading-button')).toBe(true);
    expect(button.classList.contains('mat-button-disabled')).toBe(true);
  });

  it('should remove classes and disabled when loading becomes false', () => {
    component.loading.set(true);
    fixture.detectChanges();
    fixture.detectChanges();

    component.loading.set(false);
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
    expect(button.classList.contains('loading-button')).toBe(false);
    expect(button.classList.contains('mat-button-disabled')).toBe(false);
  });

  it('should update host bindings every time input changes', () => {
    component.loading.set(true);
    fixture.detectChanges();

    expect(button.disabled).toBe(true);

    component.loading.set(false);
    fixture.detectChanges();

    expect(button.disabled).toBe(false);

    component.loading.set(true);
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
  });
});
