import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArticlesContent } from './articles-content';

import type { ArticlesViewer } from '@admin/content/model';

const fixture = vi.hoisted(() => ({
  visibility: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
}));

const fabric = {
  id: 1,
  slug: 'yak-obraty-tkanynu',
  publishedOn: '2026-10-20',
  showOnSite: true,
  titleUk: 'Як обрати тканину',
  titleRu: 'Как выбрать ткань',
  hasUkrainianText: true,
  hasRussianText: true,
  hasSeo: true,
  coverUrl: 'https://cdn.test/1-small.webp',
  updatedAtUtc: '2026-11-11T08:00:00Z',
};
const winter = {
  ...fabric,
  id: 2,
  slug: 'zymovyy-odyah',
  publishedOn: '2025-12-01',
  titleUk: 'Зимовий одяг',
  titleRu: null,
  hasRussianText: false,
  hasSeo: false,
  coverUrl: null,
};
const draft = { ...winter, id: 3, slug: 'chernetka', titleUk: 'Чернетка', showOnSite: false };
const emptyText = { title: null, excerpt: null, seoTitle: null, seoDescription: null, body: [] };
const body = [
  { kind: 'Paragraph', text: 'Шиємо **самі**.', lead: null, items: [], photoId: null, alt: null },
  { kind: 'Image', text: null, lead: null, items: [], photoId: 7, alt: 'Костюм у цеху' },
];
const detail = {
  article: fabric,
  revision: 4,
  updatedBy: 'admin@brevi.test',
  coverPhotoId: 5,
  uk: { ...emptyText, title: 'Як обрати тканину', seoTitle: 'Тканини для спецодягу', body },
  ru: emptyText,
  photos: [
    { id: 5, url: 'https://cdn.test/5.jpg', thumbnailUrl: null, width: 1200, height: 800 },
    { id: 7, url: 'https://cdn.test/7.jpg', thumbnailUrl: null, width: 1200, height: 800 },
  ],
};

vi.mock('@admin/content/data-access', () => ({
  useGetContentArticlesQuery: () => ({
    currentData: [fabric, winter, draft],
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetContentArticleQuery: (id: unknown) => ({
    currentData: typeof id === 'number' ? detail : undefined,
    isLoading: false,
    error: undefined,
  }),
  useSetContentArticleVisibilityMutation: () => [fixture.visibility, { isLoading: false }],
  useSaveContentArticleMutation: () => [fixture.save, { isLoading: false }],
  useDeleteContentArticleMutation: () => [fixture.remove, { isLoading: false }],
}));

// The «Фото» library is its own feature: here it hands back one chosen photo.
vi.mock('@admin/media/feature', () => ({
  MediaPickerDrawer: ({ onPick }: { onPick: (files: unknown[]) => void }) => (
    <button
      type="button"
      onClick={() => onPick([{ id: 9, publicUrl: 'https://cdn.test/9.jpg', alt: 'Склад тканин' }])}
    >
      Вибрати фото 9
    </button>
  ),
}));

const unwrapped = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const all: ArticlesViewer = { canCreate: true, canEdit: true, canDelete: true };
const renderPage = (viewer = all) => render(<ArticlesContent viewer={viewer} />);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ArticlesContent', () => {
  it('shows the articles with their dates and marks only what the site would miss', () => {
    renderPage();

    const table = screen.getByRole('table', { name: 'Статті сайту' });
    expect(within(table).getByText('/articles/yak-obraty-tkanynu')).toBeInTheDocument();
    expect(within(table).getByText('20.10.2026')).toBeInTheDocument();
    expect(
      within(table).getByText('Немає обкладинки · Немає назви російською · Немає SEO'),
    ).toBeInTheDocument();
    // A hidden article has nothing to miss yet.
    const hidden = within(table).getByText('Чернетка').closest('tr')!;
    expect(within(hidden).queryByText(/Немає/)).not.toBeInTheDocument();
  });

  it('switches «На сайті» from the list', async () => {
    fixture.visibility.mockReturnValue(unwrapped({ id: 3, showOnSite: true, revision: 2 }));
    renderPage();

    await userEvent.click(screen.getByRole('switch', { name: 'Показувати на сайті: Чернетка' }));

    expect(fixture.visibility).toHaveBeenCalledWith({ id: 3, showOnSite: true });
  });

  it('finds an article by its title', async () => {
    renderPage();

    await userEvent.type(screen.getByRole('textbox', { name: 'Пошук статей' }), 'зим');

    const table = screen.getByRole('table', { name: 'Статті сайту' });
    expect(within(table).getAllByRole('row')).toHaveLength(2);
  });

  it('is read-only without rights and shows the text with its photo', async () => {
    renderPage({ canCreate: false, canEdit: false, canDelete: false });

    expect(screen.queryByRole('button', { name: 'Додати статтю' })).not.toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Показувати на сайті: Чернетка' })).toBeDisabled();
    await userEvent.click(screen.getByText('Як обрати тканину'));

    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Тканини для спецодягу')).toBeInTheDocument();
    expect(within(panel).getByText('самі').tagName).toBe('STRONG');
    expect(within(panel).getByRole('img', { name: 'Костюм у цеху' })).toHaveAttribute(
      'src',
      'https://cdn.test/7.jpg',
    );
    expect(within(panel).queryByRole('button', { name: 'Редагувати' })).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: 'Видалити статтю' }),
    ).not.toBeInTheDocument();
  });

  it('adds an article with the Ukrainian title and a cover from the library', async () => {
    fixture.save.mockReturnValue(
      unwrapped({ ...detail, article: { ...draft, id: 9, titleUk: 'Нова стаття' } }),
    );
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Додати статтю' }));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Додати' }));
    expect(within(panel).getByText('Вкажіть назву українською.')).toBeInTheDocument();
    expect(fixture.save).not.toHaveBeenCalled();

    await userEvent.type(within(panel).getByRole('textbox', { name: /Назва/ }), 'Нова стаття');
    await userEvent.click(within(panel).getByRole('button', { name: 'Обрати обкладинку' }));
    await userEvent.click(screen.getByRole('button', { name: 'Вибрати фото 9', hidden: true }));
    await userEvent.click(within(panel).getByRole('button', { name: 'Додати' }));

    expect(fixture.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: null,
        revision: 0,
        slug: null,
        showOnSite: false,
        coverPhotoId: 9,
      }),
    );
    expect(fixture.save.mock.calls[0][0].uk.title).toBe('Нова стаття');
    expect(await screen.findByText(/Статтю «Нова стаття» додано/)).toBeInTheDocument();
  });

  it('edits an article in the visual editor, adds a photo and saves it with its revision', async () => {
    fixture.save.mockReturnValue(unwrapped(detail));
    renderPage();

    await userEvent.click(screen.getByText('Як обрати тканину'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    // No markup is typed: the text opens in the visual editor with its formatting and its photo.
    const field = within(panel).getByRole('textbox', { name: 'Текст статті' });
    expect(field).toHaveTextContent('Шиємо самі.');
    expect(within(field).getByRole('img', { name: 'Костюм у цеху' })).toBeInTheDocument();
    await userEvent.click(within(panel).getByRole('button', { name: 'Фото' }));
    await userEvent.click(screen.getByRole('button', { name: 'Вибрати фото 9', hidden: true }));
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    expect(fixture.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, revision: 4, slug: 'yak-obraty-tkanynu', coverPhotoId: 5 }),
    );
    const saved = fixture.save.mock.calls[0][0].uk.body;
    expect(saved).toEqual(expect.arrayContaining(body));
    expect(saved).toContainEqual({
      kind: 'Image',
      text: null,
      lead: null,
      items: [],
      photoId: 9,
      alt: 'Склад тканин',
    });
  });

  it('deletes an article after a confirmation', async () => {
    fixture.remove.mockReturnValue(unwrapped(undefined));
    renderPage();

    await userEvent.click(screen.getByText('Як обрати тканину'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Видалити статтю' }));
    const confirm = await screen.findByRole('dialog', { name: 'Видалити статтю?' });
    await userEvent.click(within(confirm).getByRole('button', { name: 'Видалити' }));

    expect(fixture.remove).toHaveBeenCalledWith(1);
    expect(await screen.findByText('Статтю «Як обрати тканину» видалено.')).toBeInTheDocument();
  });
});
