import { describe, expect, it } from 'vitest';

import { leadLinkLabel, parseLeadContacts } from './lead-contacts';

describe('parseLeadContacts', () => {
  it('splits phones, emails and links and drops repeats', () => {
    const parts = parseLeadContacts('+380 93 405 94 66; info@ls.ua, https://ls.ua', 'INFO@ls.ua');
    expect(parts).toEqual([
      { kind: 'phone', text: '+380 93 405 94 66', href: 'tel:+380934059466' },
      { kind: 'email', text: 'info@ls.ua', href: 'mailto:info@ls.ua' },
      { kind: 'link', text: 'https://ls.ua', href: 'https://ls.ua' },
    ]);
  });

  it('keeps free text as text', () => {
    expect(parseLeadContacts('через сайт', null)).toEqual([
      { kind: 'text', text: 'через сайт', href: null },
    ]);
  });

  it('shows the host of a link', () => {
    expect(leadLinkLabel('https://www.work.ua/jobs/123')).toBe('work.ua');
    expect(leadLinkLabel('не посилання')).toBe('не посилання');
  });
});
