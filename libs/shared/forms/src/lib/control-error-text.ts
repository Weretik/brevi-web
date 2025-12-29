import { AbstractControl } from '@angular/forms';

export function controlErrorText(control: AbstractControl | null): string | null {
  if (!control || !control.errors) return null;
  if (!control.touched) return null;

  // server errors
  const server = control.errors['server'] as string[] | undefined;
  if (server?.length) return server[0];

  // client validators
  if (control.errors['required']) return 'Required';
  if (control.errors['email']) return 'Invalid email';
  if (control.errors['minlength']) return 'Too short';
  if (control.errors['maxlength']) return 'Too long';

  return 'Invalid value';
}
