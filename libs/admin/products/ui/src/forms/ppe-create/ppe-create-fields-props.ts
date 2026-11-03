import type {
  PpeCreateField,
  PpeCreateFieldErrors,
  PpeCreateFormValues,
} from '@admin/products/model';

/** Props every block of the page «Новий ЗІЗ» shares. */
export interface PpeCreateFieldsProps {
  values: PpeCreateFormValues;
  /** Errors to show now: touched fields and the server's answer. */
  errors: PpeCreateFieldErrors;
  disabled: boolean;
  onChange: <Field extends PpeCreateField>(field: Field, value: PpeCreateFormValues[Field]) => void;
}
