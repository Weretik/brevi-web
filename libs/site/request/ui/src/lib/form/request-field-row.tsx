import type { RequestDictionary } from '../i18n/request-dictionary';
import type { RequestField } from '@site/request/model';
import type { ReactNode } from 'react';

/** One field of the request form: the label (a star for the phone, «необовʼязково» for the rest), the control, a hint and the error. */
export function RequestFieldRow({
  name,
  text,
  error,
  hint,
  children,
}: {
  name: RequestField;
  text: RequestDictionary['form'];
  error: keyof RequestDictionary['form']['errors'] | undefined;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={`request-${name}`} className="text-sm font-bold">
        {text.fields[name].label}{' '}
        {name === 'phone' ? (
          <span aria-hidden className="text-brand-text">
            *
          </span>
        ) : (
          <span className="font-medium text-muted-foreground">{text.optional}</span>
        )}
      </label>
      {children}
      {hint ? (
        <p id={`request-${name}-hint`} className="text-[0.8125rem] text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`request-${name}-error`} className="text-sm font-semibold text-red-700">
          {text.errors[error]}
        </p>
      ) : null}
    </div>
  );
}
