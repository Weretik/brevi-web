import type { CustomConfiguration } from '../../entities/custom-sewing/custom-configuration';

function norm(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value > 0 &&
    value <= 100000 &&
    /^\d+(?:\.\d{1,6})?$/.test(String(value))
  );
}
function money(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 10000000 &&
    /^\d+(?:\.\d{1,2})?$/.test(String(value))
  );
}
export function customConfigurationErrors(
  value: CustomConfiguration,
  calculate = false,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value.name.trim() || value.name.length > 300)
    errors['name'] = 'Вкажіть назву, до 300 символів.';
  if (!value.productType.trim() || value.productType.length > 100)
    errors['productType'] = 'Вкажіть тип виробу, до 100 символів.';
  for (const field of ['description', 'clientComment', 'internalNote'] as const)
    if (value[field].length > 5000) errors[field] = 'Максимум 5000 символів.';
  for (const field of ['fabrics', 'accessories'] as const) {
    const rows = value[field];
    if (
      rows.length > (field === 'fabrics' ? 40 : 100) ||
      rows.some(
        (row) =>
          !Number.isSafeInteger(row.referenceId) ||
          row.referenceId <= 0 ||
          !norm(row.quantity) ||
          !row.unit.trim() ||
          row.unit.length > 50,
      )
    )
      errors[field] =
        'Оберіть довідникові позиції, одиниці до 50 символів та додатні норми до 100000 (до 6 знаків після коми).';
  }
  if (
    value.operations.length > 100 ||
    value.operations.some(
      (row) =>
        !Number.isSafeInteger(row.referenceId) ||
        row.referenceId <= 0 ||
        !norm(row.quantity) ||
        (row.manualMinutes !== null && !norm(row.manualMinutes)),
    )
  )
    errors['operations'] = 'Оберіть операції, додатну кількість і, за потреби, додатні хвилини.';
  if (calculate && !value.fabrics.length) errors['fabrics'] = 'Для розрахунку потрібна тканина.';
  if (calculate && !value.operations.length)
    errors['operations'] = 'Для розрахунку потрібна операція.';
  if (
    value.applications.length > 20 ||
    value.applications.some(
      (row) => row.location.length > 200 || !money(row.cost) || !money(row.saleAmount),
    )
  )
    errors['applications'] = 'Перевірте місце нанесення й суми (до двох знаків після коми).';
  if (!money(value.delivery))
    errors['delivery'] = 'Вкажіть невід’ємну суму доставки, до двох знаків.';
  if (!money(value.packaging))
    errors['packaging'] = 'Вкажіть невід’ємну суму пакування, до двох знаків.';
  return errors;
}
