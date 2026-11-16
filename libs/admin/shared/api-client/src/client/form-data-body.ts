type FormScalar = Blob | string | number | boolean | null | undefined;
type FormValue = FormScalar | readonly FormScalar[];

const toFormData = (fields: unknown): FormData => {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields as Record<string, FormValue>)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item === undefined || item === null) continue;
      form.append(name, item instanceof Blob ? item : String(item));
    }
  }

  return form;
};

/**
 * Upload fields of a `multipart/form-data` operation; a list becomes repeated fields. The contract types a file
 * (`format: binary`) as a string, so the body is typed by the call and the fields go out as `FormData`. Send a `File`
 * to keep its name.
 */
export const formDataBody = (fields: Record<string, FormValue>) => ({
  body: fields as never,
  bodySerializer: toFormData,
});
