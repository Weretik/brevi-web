/** A picture of the library is shown; a picture that stays on the site itself is named. */
export function managerPhotoSrc(url: string | null): string | undefined {
  return url && /^https:\/\//.test(url) ? url : undefined;
}

/** What the map link of the site opens: a Google Maps search for the address. */
export function companyMapUrl(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}
