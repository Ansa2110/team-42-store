import type {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (
    control: AbstractControl<string | null>,
  ): ValidationErrors | null => {
    const value = control.value ?? '';

    if (!value) {
      return null;
    }

    const isStrong =
      value.length >= 8 &&
      /[A-Za-zА-Яа-яЁё]/.test(value) &&
      /\d/.test(value);

    return isStrong ? null : { strongPassword: true };
  };
}

export function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordsMismatch: true };
}
