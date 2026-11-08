import { describe, expect, it } from 'vitest';

import { leadScript } from './lead-script';

describe('leadScript', () => {
  it('builds the opening from the signal, the offer and whom to ask', () => {
    const text = leadScript({
      company: 'L&S Distributions',
      signal: 'Відкривають новий склад.',
      offer: 'Жилети, куртки',
      whomToCall: 'Адміністрацію / логістику',
    });
    expect(text).toContain('у L&S Distributions: відкривають новий склад.');
    expect(text).toContain('Можемо запропонувати: жилети, куртки.');
    expect(text).toContain('з ким поговорити: адміністрацію / логістику?');
  });

  it('asks for the buyer when the sheet has no contact person', () => {
    const text = leadScript({ company: 'X', signal: null, offer: null, whomToCall: null });
    expect(text).toContain('хто у вас відповідає за закупівлю');
  });
});
