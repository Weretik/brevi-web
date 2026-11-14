/**
 * Gzips the finance.json export (about 40 MB) in the browser so it fits the API request limit (32 MiB); the server
 * unpacks it. Without `CompressionStream` or `File.stream` (very old browsers) the file goes as is.
 */
export async function compressFinanceFile(file: File): Promise<Blob> {
  if (typeof CompressionStream === 'undefined' || typeof file.stream !== 'function') return file;
  const stream = file.stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).blob();
}
