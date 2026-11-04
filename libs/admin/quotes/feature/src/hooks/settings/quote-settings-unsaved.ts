import { emptyLetterVariantDraft } from '@admin/quotes/model';

import type { QuoteSettingsDraft } from '@admin/quotes/model';

const storageKey = 'brevi.quote-settings.unsaved';

/**
 * Keeps unsaved settings while the person signs in to Google for «Підключити Gmail» (the tab leaves the page);
 * the page takes them back once, and only if nobody saved a newer version meanwhile.
 */
export const quoteSettingsUnsaved = {
  keep(draft: QuoteSettingsDraft) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // Without storage the changes are lost, as before.
    }
  },
  take(version: number): QuoteSettingsDraft | null {
    try {
      const text = sessionStorage.getItem(storageKey);
      sessionStorage.removeItem(storageKey);
      const draft = text ? (JSON.parse(text) as QuoteSettingsDraft) : null;
      return draft && draft.version === version ? draft : null;
    } catch {
      return null;
    }
  },
};

/** Takes the Gmail addresses from the server and keeps everything the person typed. */
export function withMailboxes(
  draft: QuoteSettingsDraft,
  fresh: QuoteSettingsDraft,
): QuoteSettingsDraft {
  const mailboxes = new Map(
    fresh.staffContacts.map((contact) => [contact.userId, contact.mailboxEmail]),
  );
  return {
    ...draft,
    staffContacts: draft.staffContacts.map((contact) => ({
      ...contact,
      mailboxEmail: mailboxes.get(contact.userId) ?? contact.mailboxEmail,
    })),
  };
}

/** The kept changes over fresh settings: today's Gmail addresses and letter keys of this page. */
export function restoreUnsaved(
  unsaved: QuoteSettingsDraft,
  fresh: QuoteSettingsDraft,
): QuoteSettingsDraft {
  return withMailboxes(
    {
      ...unsaved,
      letterVariants: unsaved.letterVariants.map((variant, index) => ({
        ...variant,
        key: fresh.letterVariants[index]?.key ?? emptyLetterVariantDraft().key,
      })),
    },
    fresh,
  );
}
