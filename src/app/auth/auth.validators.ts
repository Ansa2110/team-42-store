import type {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value ?? '';

    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasLetter = /[A-Za-zА-Яа-я]/.test(value);
    const hasNumber = /\d/.test(value);

    if (hasMinLength && hasLetter && hasNumber) {
      return null;
    }

    return {
      strongPassword: true,
    };
  };
}
