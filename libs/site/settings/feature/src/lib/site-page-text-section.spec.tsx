import { render, screen } from '@testing-library/react';

import { SitePageTextSection } from './site-page-text-section';

import type { SitePageText } from '@site/settings/data-access';

const page = vi.hoisted(() => ({ saved: undefined as SitePageText | undefined }));

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSitePageText: async () => page.saved,
}));

afterEach(() => {
  page.saved = undefined;
});

describe('SitePageTextSection', () => {
  it('shows nothing while staff wrote neither text nor questions', async () => {
    expect(await SitePageTextSection({ pageKey: 'wholesale', locale: 'uk' })).toBeNull();
    page.saved = { title: 'Оптом', description: null, text: [], faq: [] };
    expect(await SitePageTextSection({ pageKey: 'wholesale', locale: 'uk' })).toBeNull();
  });

  it('shows the text and the questions with the same FAQPage', async () => {
    page.saved = {
      title: null,
      description: null,
      text: [
        { type: 'heading', text: 'Пошиття оптом' },
        { type: 'paragraph', text: 'Від **5 штук**.' },
      ],
      faq: [{ question: 'Яка партія?', answer: 'Від 5 штук.' }],
    };
    const { container } = render(await SitePageTextSection({ pageKey: 'wholesale', locale: 'ru' }));

    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Пошиття оптом');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Частые вопросы');
    expect(container.querySelectorAll('details')).toHaveLength(1);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    ) as { '@type': string; mainEntity: { name: string }[] };
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity.map((item) => item.name)).toEqual(['Яка партія?']);
  });
});
