'use client';

import {
  REQUEST_FORM_IDLE,
  REQUEST_ID_FIELD,
  REQUEST_TRAP_FIELD,
  formatUkrainianPhone,
} from '@site/request/model';
import { Button } from '@site/shared/ui';
import Link from 'next/link';
import { useActionState, useState } from 'react';

import { RequestFormFields } from './request-form-fields';
import { useRequestId } from './use-request-id';
import { RequestSent } from '../sections/request-sent';

import type { RequestDictionary } from '../i18n/request-dictionary';
import type { Company } from '@site/core/config';
import type { RequestFormState } from '@site/request/model';

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
  /** Product of a «Купити» button; the form opens with it in «Що потрібно пошити?». */
  product?: string;
};

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
  product,
  onAgain,
}: RequestFormProps & { onAgain: () => void }) {
  const [state, formAction, pending] = useActionState(action, REQUEST_FORM_IDLE);
  const requestId = useRequestId();
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

  const values =
    state.status !== 'idle'
      ? state.values
      : product
        ? { phone: '', workwear: product, quantity: '', comment: '' }
        : undefined;
  const errors = state.status === 'invalid' ? state.errors : {};

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

      <RequestFormFields text={text} values={values} errors={errors} />

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
      <input type="hidden" name={REQUEST_ID_FIELD} value={requestId} readOnly />

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
