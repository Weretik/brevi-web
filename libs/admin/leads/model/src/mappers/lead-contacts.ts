export type LeadContactKind = 'phone' | 'email' | 'link' | 'text';

export interface LeadContact {
  readonly kind: LeadContactKind;
  readonly text: string;
  /** `tel:`, `mailto:` or the URL; null for plain text. */
  readonly href: string | null;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\/\S+$/i;

/**
 * Splits «Открытый контакт» as the AI writes it («+380 93 405 94 66; info@site.ua», «0 800 21 82 99»,
 * a link) into parts the card can call, mail or open.
 */
export function parseLeadContacts(...values: readonly (string | null)[]): readonly LeadContact[] {
  const seen = new Set<string>();
  const result: LeadContact[] = [];
  for (const value of values) {
    if (!value) continue;
    for (const raw of value.split(/[;,\n]+/)) {
      const text = raw.trim();
      if (!text || seen.has(text.toLowerCase())) continue;
      seen.add(text.toLowerCase());
      result.push(contact(text));
    }
  }
  return result;
}

function contact(text: string): LeadContact {
  if (emailPattern.test(text)) return { kind: 'email', text, href: `mailto:${text}` };
  if (urlPattern.test(text)) return { kind: 'link', text, href: text };
  const digits = text.replace(/[^\d+]/g, '');
  const count = digits.replace(/\D/g, '').length;
  if (count >= 9 && count <= 13 && /^[\d+\s()\-–]+$/.test(text))
    return { kind: 'phone', text, href: `tel:${digits}` };
  return { kind: 'text', text, href: null };
}

/** «work.ua» from a long signal link. */
export function leadLinkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
