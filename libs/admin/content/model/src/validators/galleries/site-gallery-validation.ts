import type {
  SiteGallery,
  SiteGalleryInput,
  SiteGalleryItem,
  SiteGalleryItemInput,
  SiteGalleryKind,
} from '../../entities/galleries/site-gallery';

/** Limits of BreviERP CNT-011. */
export const siteGalleryLimits = {
  works: 300,
  certificates: 40,
  title: 300,
  note: 600,
  standards: 10,
  standard: 200,
} as const;

/** The side panel of one picture: texts by language and the standards one per line. */
export interface SiteGalleryItemFormValues {
  titleUk: string;
  titleRu: string;
  noteUk: string;
  noteRu: string;
  standards: string;
}

export type SiteGalleryItemErrors = Partial<Record<keyof SiteGalleryItemFormValues, string>>;

export function siteGalleryItemFormOf(item: SiteGalleryItem): SiteGalleryItemFormValues {
  return {
    titleUk: item.title.uk,
    titleRu: item.title.ru,
    noteUk: item.note.uk,
    noteRu: item.note.ru,
    standards: item.standards.join('\n'),
  };
}

const lines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export function validateSiteGalleryItem(
  kind: SiteGalleryKind,
  values: SiteGalleryItemFormValues,
): SiteGalleryItemErrors {
  const errors: SiteGalleryItemErrors = {};
  const long = (value: string, max: number) =>
    value.trim().length > max ? `Не більше ${max} символів.` : undefined;
  if (kind === 'certificates' && !values.titleUk.trim())
    errors.titleUk = 'Вкажіть назву документа українською.';
  errors.titleUk ??= long(values.titleUk, siteGalleryLimits.title);
  errors.titleRu = long(values.titleRu, siteGalleryLimits.title);
  errors.noteUk = long(values.noteUk, siteGalleryLimits.note);
  errors.noteRu = long(values.noteRu, siteGalleryLimits.note);
  const standards = lines(values.standards);
  if (standards.length > siteGalleryLimits.standards)
    errors.standards = `Не більше ${siteGalleryLimits.standards} рядків.`;
  else if (standards.some((x) => x.length > siteGalleryLimits.standard))
    errors.standards = `Рядок: не більше ${siteGalleryLimits.standard} символів.`;
  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value),
  ) as SiteGalleryItemErrors;
}

const text = (uk: string, ru: string) =>
  uk.trim() || ru.trim() ? { uk: uk.trim(), ru: ru.trim() } : null;

/** A picture as saved: unchanged texts are sent back as they are. */
export function siteGalleryItemInputOf(item: SiteGalleryItem): SiteGalleryItemInput {
  return {
    photoId: item.photoId,
    legacyPath: item.photoId === null ? item.legacyPath : null,
    title: text(item.title.uk, item.title.ru),
    note: text(item.note.uk, item.note.ru),
    standards: item.standards.length > 0 ? item.standards : null,
  };
}

/** The picture with the texts of the side panel. */
export function applySiteGalleryItemForm(
  item: SiteGalleryItem,
  values: SiteGalleryItemFormValues,
): SiteGalleryItem {
  return {
    ...item,
    title: { uk: values.titleUk.trim(), ru: values.titleRu.trim() },
    note: { uk: values.noteUk.trim(), ru: values.noteRu.trim() },
    standards: lines(values.standards),
  };
}

/** A new picture from the «Фото» library, without texts yet. */
export function newSiteGalleryItem(photo: {
  id: number;
  publicUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
}): SiteGalleryItem {
  return {
    photoId: photo.id,
    legacyPath: null,
    url: photo.publicUrl,
    thumbnailUrl: photo.thumbnailUrl ?? photo.publicUrl,
    width: photo.width,
    height: photo.height,
    missing: false,
    title: { uk: '', ru: '' },
    note: { uk: '', ru: '' },
    standards: [],
  };
}

export function siteGalleryInputOf(
  gallery: SiteGallery,
  items: SiteGalleryItem[],
): SiteGalleryInput {
  return {
    kind: gallery.kind,
    revision: gallery.revision,
    items: items.map(siteGalleryItemInputOf),
  };
}

/** Moves a picture one place up or down; out of range leaves the list as it is. */
export function moveSiteGalleryItem<T>(items: readonly T[], index: number, by: -1 | 1): T[] {
  const target = index + by;
  if (target < 0 || target >= items.length) return [...items];
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
