import { AbstractControl, FormGroup } from '@angular/forms';
import type { ApiError } from '@shared/util';

export function applyServerErrors(form: FormGroup, error: ApiError): void {
  if (error.code !== 'Validation' || !error.fieldErrors) return;

  for (const [rawKey, messages] of Object.entries(error.fieldErrors)) {
    const key = normalizeKey(rawKey);
    const control = findControl(form, key);

    if (!control) continue;

    const current = control.errors ?? {};
    control.setErrors({
      ...current,
      server: messages,
    });

    control.markAsTouched();
    control.updateValueAndValidity({ emitEvent: false });
  }
}

function normalizeKey(key: string): string {
  if (!key) return key;
  return key.length === 1 ? key.toLowerCase() : key[0].toLowerCase() + key.slice(1);
}

function findControl(form: FormGroup, path: string): AbstractControl | null {
  return form.get(path) ?? form.get(fallbackVariants(path)) ?? null;
}

function fallbackVariants(path: string): string {
  return path[0].toUpperCase() + path.slice(1);
}
