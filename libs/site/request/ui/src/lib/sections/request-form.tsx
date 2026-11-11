'use client';

import {
  REQUEST_ATTACHMENT_EXTENSIONS,
  REQUEST_FIELD_LIMITS,
  REQUEST_FORM_IDLE,
  REQUEST_TRAP_FIELD,
  formatUkrainianPhone,
} from '@site/request/model';
import { Button, cn } from '@site/shared/ui';
import Link from 'next/link';
import { useActionState, useState } from 'react';

import { RequestSent } from './request-sent';

import type { RequestDictionary } from '../i18n/request-dictionary';
import type { Company } from '@site/core/config';
import type { RequestField, RequestFormState, RequestTextField } from '@site/request/model';
import type { ReactNode } from 'react';

export type RequestFormAction = (
  state: RequestFormState,
  formData: FormData,
) => Promise<RequestFormState>;

type RequestFormProps = {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  dictionary: Pick<RequestDictionary, 'form' | 'sent'>;
  /** Server Action that checks the request and passes it to a manager. */
  action: RequestFormAction;
  agreementHref: string;
  catalogHref: string;
};

const FIELD_CLASS =
  'w-full rounded-md border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground aria-invalid:border-red-700';

/**
 * The request form of the live site: the phone is the only required field, the rest is marked optional.
 * After a request is accepted the form gives way to `RequestSent`.
 */
export function RequestForm(props: RequestFormProps) {
  const [attempt, setAttempt] = useState(0);
  return <RequestFormAttempt key={attempt} {...props} onAgain={() => setAttempt(attempt + 1)} />;
}

function RequestFormAttempt({
  company,
  dictionary,
  action,
  agreementHref,
  catalogHref,
  onAgain,
}: RequestFormProps & { onAgain: () => void }) {
  const [state, formAction, pending] = useActionState(action, REQUEST_FORM_IDLE);
  const [companyPhone] = company.phones;
  const text = dictionary.form;

  if (state.status === 'sent') {
    return (
      <RequestSent
        company={company}
        dictionary={dictionary.sent}
        phone={formatUkrainianPhone(state.phone)}
        catalogHref={catalogHref}
        onAgain={onAgain}
      />
    );
  }

  const values = state.status === 'idle' ? undefined : state.values;
  const errors = state.status === 'invalid' ? state.errors : {};
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
  const field = (name: RequestField, control: ReactNode, hint?: string) => {
    const code = errors[name];
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
        {control}
        {hint ? (
          <p id={`request-${name}-hint`} className="text-[0.8125rem] text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {code ? (
          <p id={`request-${name}-error`} className="text-sm font-semibold text-red-700">
            {text.errors[code]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form
      action={formAction}
      noValidate
      aria-labelledby="request-form-title"
      className="relative grid gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <h2
        id="request-form-title"
        className="text-2xl leading-tight font-extrabold tracking-[-0.015em]"
      >
        {text.title}
      </h2>

      {state.status === 'unavailable' ? (
        <div role="alert" className="grid gap-1 rounded-lg bg-background p-4">
          <p className="font-extrabold">{text.unavailableTitle}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {text.unavailableText}{' '}
            <a
              href={`tel:${companyPhone.e164}`}
              className="font-extrabold whitespace-nowrap text-foreground hover:underline"
            >
              {companyPhone.display}
            </a>
          </p>
        </div>
      ) : null}

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

      {/* Bots fill every field; people never reach this one (not in the tab order, hidden from screen readers). */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input
          type="text"
          name={REQUEST_TRAP_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled={pending}
        className="h-14 text-[1.0625rem] whitespace-normal"
      >
        {pending ? text.sending : text.submit}
      </Button>

      <p className="text-[0.8125rem] leading-normal text-muted-foreground">
        {text.requiredHint} {text.consentBefore}{' '}
        <Link href={agreementHref} className="font-semibold text-brand-text underline">
          {text.consentLink}
        </Link>
        .
      </p>
    </form>
  );
}
