import { REQUEST_ATTACHMENT_EXTENSIONS, REQUEST_FIELD_LIMITS } from '@site/request/model';
import { cn } from '@site/shared/ui';

import { RequestFieldRow } from './request-field-row';

import type { RequestDictionary } from '../i18n/request-dictionary';
import type { RequestField, RequestFormState, RequestTextField } from '@site/request/model';
import type { ReactNode } from 'react';

type Invalid = Extract<RequestFormState, { status: 'invalid' }>;

const FIELD_CLASS =
  'w-full rounded-md border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground aria-invalid:border-red-700';

/** The fields of the request form: the phone (required), what to sew, how many, a comment and a file. */
export function RequestFormFields({
  text,
  values,
  errors,
}: {
  text: RequestDictionary['form'];
  values: Invalid['values'] | undefined;
  errors: Partial<Invalid['errors']>;
}) {
  const describedBy = (name: RequestField, hint?: boolean) =>
    [errors[name] ? `request-${name}-error` : '', hint ? `request-${name}-hint` : '']
      .filter(Boolean)
      .join(' ') || undefined;
  const textInput = (name: RequestTextField) => ({
    id: `request-${name}`,
    name,
    defaultValue: values?.[name],
    placeholder: text.fields[name].placeholder,
    maxLength: REQUEST_FIELD_LIMITS[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': describedBy(name),
  });
  const field = (name: RequestField, control: ReactNode, hint?: string) => (
    <RequestFieldRow name={name} text={text} error={errors[name]} hint={hint}>
      {control}
    </RequestFieldRow>
  );

  return (
    <>
      {field(
        'phone',
        <input
          {...textInput('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          className={cn(FIELD_CLASS, 'h-13')}
        />,
      )}
      {field(
        'workwear',
        <input {...textInput('workwear')} type="text" className={cn(FIELD_CLASS, 'h-13')} />,
      )}
      {field(
        'quantity',
        <input {...textInput('quantity')} type="text" className={cn(FIELD_CLASS, 'h-13')} />,
      )}
      {field(
        'comment',
        <textarea {...textInput('comment')} rows={3} className={cn(FIELD_CLASS, 'py-3')} />,
      )}
      {field(
        'attachment',
        <input
          id="request-attachment"
          name="attachment"
          type="file"
          accept={REQUEST_ATTACHMENT_EXTENSIONS.join(',')}
          aria-invalid={errors.attachment ? true : undefined}
          aria-describedby={describedBy('attachment', true)}
          className="w-full text-sm text-muted-foreground file:mr-3 file:h-11 file:cursor-pointer file:rounded-md file:border file:border-solid file:border-border-strong file:bg-background file:px-4 file:text-sm file:font-bold file:text-foreground"
        />,
        text.attachmentHint,
      )}
    </>
  );
}
