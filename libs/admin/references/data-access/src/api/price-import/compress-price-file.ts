/**
 * Gzips a price file in the browser so three 17 MB Insight lists fit the API request limit (CAT-017 R-08); the
 * server unpacks it. Without `CompressionStream` or `File.stream` (very old browsers) the file goes as is.
 */
export async function compressPriceFile(file: File): Promise<Blob> {
  if (typeof CompressionStream === 'undefined' || typeof file.stream !== 'function') return file;
  const stream = file.stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).blob();
}
