/** A line comment is text up to 500 characters or none; older backends omit it. */
export function isSewingLineComment(value: unknown): boolean {
  return (
    value === undefined || value === null || (typeof value === 'string' && value.length <= 500)
  );
}
