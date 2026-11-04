import { quoteSettingsSections } from '@admin/quotes/model';
import { quoteSettingsAnchor } from '@admin/quotes/ui';
import { useEffect, useState } from 'react';

import type { QuoteSettingsSectionId } from '@admin/quotes/model';

/** A section is current once its top passes under the sticky app bar. */
const currentLine = 140;

/** The section in view for «Розділи», and a jump to a section. */
export function useSettingsSections(ready: boolean) {
  const [active, setActive] = useState<QuoteSettingsSectionId>('company');

  useEffect(() => {
    if (!ready) return;
    const update = () => {
      const passed = quoteSettingsSections.filter((section) => {
        const element = document.getElementById(quoteSettingsAnchor(section.id));
        return element !== null && element.getBoundingClientRect().top <= currentLine;
      });
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const last = quoteSettingsSections[quoteSettingsSections.length - 1];
      setActive(atBottom && last ? last.id : (passed[passed.length - 1]?.id ?? 'company'));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [ready]);

  return {
    active,
    goTo: (id: QuoteSettingsSectionId) => {
      setActive(id);
      document
        .getElementById(quoteSettingsAnchor(id))
        ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    },
  };
}
