import type {
  OldSitePhotoImportFile,
  OldSiteProduct,
} from '../../entities/product-photos/product-photos';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function readProduct(value: unknown): OldSiteProduct | null {
  if (!isRecord(value)) return null;
  const { oldId, oldName, skus, photos, newModel } = value;
  if (!Number.isInteger(oldId) || typeof oldName !== 'string') return null;
  if (!Array.isArray(skus) || !skus.every((sku) => typeof sku === 'string')) return null;
  if (!Array.isArray(photos)) return null;
  const parsedPhotos = photos.map((photo) =>
    isRecord(photo) && typeof photo['path'] === 'string'
      ? { path: photo['path'], isMain: photo['isMain'] === true }
      : null,
  );
  if (parsedPhotos.some((photo) => photo === null)) return null;
  let model: OldSiteProduct['newModel'] = null;
  if (newModel !== undefined && newModel !== null) {
    if (
      !isRecord(newModel) ||
      typeof newModel['name'] !== 'string' ||
      typeof newModel['section'] !== 'string'
    )
      return null;
    model = {
      name: newModel['name'],
      section: newModel['section'],
      season:
        newModel['season'] === 'Літо' || newModel['season'] === 'Зима' ? newModel['season'] : null,
    };
  }
  return {
    oldId: oldId as number,
    oldName,
    skus: skus as string[],
    photos: parsedPhotos as OldSiteProduct['photos'],
    newModel: model,
  };
}

/** Reads «old-site-photo-import.json» (CAT-018); null when the text is not that file. */
export function parseOldSitePhotoImportFile(text: string): OldSitePhotoImportFile | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord(value) || typeof value['baseUrl'] !== 'string' || !Array.isArray(value['products']))
    return null;
  const products = value['products'].map(readProduct);
  if (products.length === 0 || products.some((product) => product === null)) return null;
  return { baseUrl: value['baseUrl'], products: products as OldSiteProduct[] };
}
