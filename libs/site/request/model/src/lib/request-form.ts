/**
 * Text fields of the «Заявка» form, the same as on the live `brevi.com.ua` request form.
 * Only the phone is required; a file (a brief or a logo layout) travels next to them as `attachment`.
 */
export type RequestFormValues = {
  phone: string;
  workwear: string;
  quantity: string;
  comment: string;
};

export type RequestTextField = keyof RequestFormValues;
export type RequestField = RequestTextField | 'attachment';

/** Why a field was rejected; the page turns the code into text in the visitor's language. */
export type RequestFieldError =
  'required' | 'tooLong' | 'invalidPhone' | 'fileTooLarge' | 'fileType';

export type RequestFieldErrors = Partial<Record<RequestField, RequestFieldError>>;

/**
 * State the form shows after a submit attempt.
 * `unavailable` means the request was valid but could not be passed to a manager, so the page asks to call.
 * A chosen file is not kept between attempts: the browser does not let a page fill a file field.
 */
export type RequestFormState =
  | { status: 'idle' }
  | { status: 'invalid'; values: RequestFormValues; errors: RequestFieldErrors }
  | { status: 'unavailable'; values: RequestFormValues }
  | { status: 'sent'; phone: string };

export const REQUEST_FORM_IDLE: RequestFormState = { status: 'idle' };

export const REQUEST_FIELD_LIMITS: Record<RequestTextField, number> = {
  phone: 32,
  workwear: 200,
  quantity: 60,
  comment: 1000,
};

/** The live form accepts a brief or a layout up to 10 MB in these formats. */
export const REQUEST_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const REQUEST_ATTACHMENT_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.zip',
  '.rar',
  '.7z',
  '.jpg',
  '.jpeg',
  '.png',
  '.cdr',
  '.ai',
  '.eps',
  '.psd',
] as const;
