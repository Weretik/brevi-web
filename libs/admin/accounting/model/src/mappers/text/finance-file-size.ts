/** «245 КБ», «1,4 МБ». */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / (1024 * 1024)).toLocaleString('uk-UA', { maximumFractionDigits: 1 })} МБ`;
}
