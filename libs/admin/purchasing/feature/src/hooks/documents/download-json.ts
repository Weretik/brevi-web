/** Hands the browser a JSON value as a file to save. */
export function downloadJson(value: unknown, fileName: string) {
  const text = JSON.stringify(value, null, 2);
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
