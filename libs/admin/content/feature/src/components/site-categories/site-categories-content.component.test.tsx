import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteCategoriesContent } from './site-categories-content';

import type { SiteCategoriesViewer } from '@admin/content/model';

const fixture = vi.hoisted(() => ({
  visibility: vi.fn(),
  reorder: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
  transfer: vi.fn(),
}));

const clothes = {
  id: 1,
  parentId: null,
  slug: 'spetsodyah',
  sortOrder: 1,
  showOnSite: true,
  onSite: true,
  nameUk: 'Спецодяг',
  nameRu: 'Спецодежда',
  hasUkrainianText: true,
  hasRussianText: true,
  hasSeo: true,
  productCount: 12,
  updatedAtUtc: '2026-11-11T08:00:00Z',
};
const suits = { ...clothes, id: 2, parentId: 1, slug: 'kostyumy', nameUk: 'Костюми', nameRu: null };
const jackets = {
  ...clothes,
  id: 3,
  parentId: 1,
  slug: 'kurtky',
  sortOrder: 2,
  nameUk: 'Куртки',
  showOnSite: false,
  onSite: false,
  hasSeo: false,
};
const ppe = {
  ...clothes,
  id: 4,
  slug: 'zasoby-zakhystu',
  sortOrder: 2,
  nameUk: 'Засоби захисту',
  showOnSite: false,
  onSite: false,
  productCount: 0,
};
const emptyText = { name: null, seoTitle: null, seoDescription: null, text: [] };
const detail = {
  category: suits,
  revision: 4,
  updatedBy: 'admin@brevi.test',
  uk: {
    ...emptyText,
    name: 'Костюми',
    seoTitle: 'Купити робочі костюми',
    text: [{ kind: 'Paragraph', text: 'Шиємо **самі**.', lead: null, items: [] }],
  },
  ru: emptyText,
};

vi.mock('@admin/content/data-access', () => ({
  useGetSiteCategoriesQuery: () => ({
    currentData: [clothes, suits, jackets, ppe],
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useGetSiteCategoryQuery: (id: unknown) => ({
    currentData: typeof id === 'number' ? detail : undefined,
    isLoading: false,
    error: undefined,
  }),
  useSetSiteCategoryVisibilityMutation: () => [fixture.visibility, { isLoading: false }],
  useReorderSiteCategoriesMutation: () => [fixture.reorder, { isLoading: false }],
  useSaveSiteCategoryMutation: () => [fixture.save, { isLoading: false }],
  useDeleteSiteCategoryMutation: () => [fixture.remove, { isLoading: false }],
  useImportOldSiteCategoriesMutation: () => [fixture.transfer, { isLoading: false }],
}));

const unwrapped = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const all: SiteCategoriesViewer = { canCreate: true, canEdit: true, canDelete: true };
const renderPage = (viewer = all) => render(<SiteCategoriesContent viewer={viewer} />);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SiteCategoriesContent', () => {
  it('shows the tree and marks only what the site would miss', () => {
    renderPage();

    const table = screen.getByRole('table', { name: 'Розділи сайту' });
    const names = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[0].textContent);
    expect(names).toEqual([
      'Спецодяг/catalog/spetsodyah',
      'Костюми/catalog/kostyumy',
      'Куртки/catalog/kurtky',
      'Засоби захисту/catalog/zasoby-zakhystu',
    ]);
    expect(within(table).getByText('Немає назви російською')).toBeInTheDocument();
    // A hidden category has nothing to miss yet.
    const hidden = within(table).getByText('Засоби захисту').closest('tr')!;
    expect(within(hidden).queryByText(/Немає/)).not.toBeInTheDocument();
  });

  it('switches «На сайті» and warns when the parent category is hidden', async () => {
    fixture.visibility.mockReturnValue(
      unwrapped({ id: 3, showOnSite: true, onSite: false, revision: 2 }),
    );
    renderPage();

    await userEvent.click(screen.getByRole('switch', { name: 'Показувати на сайті: Куртки' }));

    expect(fixture.visibility).toHaveBeenCalledWith({ id: 3, showOnSite: true });
    expect(await screen.findByText(/розділ верхнього рівня приховано/)).toBeInTheDocument();
  });

  it('moves a category among its neighbours', async () => {
    fixture.reorder.mockReturnValue(unwrapped(undefined));
    renderPage();

    expect(screen.getByRole('button', { name: 'Вище: Костюми' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Нижче: Куртки' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Нижче: Костюми' }));
    await userEvent.click(screen.getByRole('button', { name: 'Вище: Засоби захисту' }));

    expect(fixture.reorder).toHaveBeenNthCalledWith(1, { parentId: 1, ids: [3, 2] });
    expect(fixture.reorder).toHaveBeenNthCalledWith(2, { parentId: null, ids: [4, 1] });
  });

  it('finds a subcategory with its category and locks the order while searching', async () => {
    renderPage();

    await userEvent.type(screen.getByRole('textbox', { name: 'Пошук розділів сайту' }), 'курт');

    const table = screen.getByRole('table', { name: 'Розділи сайту' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('Спецодяг')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вище: Куртки' })).toBeDisabled();
  });

  it('is read-only without rights', async () => {
    renderPage({ canCreate: false, canEdit: false, canDelete: false });

    expect(screen.queryByRole('button', { name: 'Додати розділ' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Додати підрозділ/ })).not.toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Показувати на сайті: Спецодяг' })).toBeDisabled();
    await userEvent.click(screen.getByText('Костюми'));

    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Купити робочі костюми')).toBeInTheDocument();
    expect(within(panel).getByText('самі').tagName).toBe('STRONG');
    expect(within(panel).queryByRole('button', { name: 'Редагувати' })).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: 'Видалити розділ' }),
    ).not.toBeInTheDocument();
  });

  it('adds a subcategory with only the Ukrainian name', async () => {
    fixture.save.mockReturnValue(
      unwrapped({ ...detail, category: { ...jackets, id: 9, nameUk: 'Жилети' } }),
    );
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Додати підрозділ: Спецодяг' }));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Додати' }));
    expect(within(panel).getByText('Вкажіть назву українською.')).toBeInTheDocument();
    expect(fixture.save).not.toHaveBeenCalled();

    await userEvent.type(within(panel).getByRole('textbox', { name: /Назва/ }), 'Жилети');
    await userEvent.click(within(panel).getByRole('button', { name: 'Додати' }));

    expect(fixture.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: null,
        revision: 0,
        parentId: 1,
        slug: null,
        showOnSite: false,
      }),
    );
    expect(fixture.save.mock.calls[0][0].uk.name).toBe('Жилети');
    expect(await screen.findByText(/Розділ «Жилети» додано/)).toBeInTheDocument();
  });

  it('edits a category in the visual editor and saves it with its revision', async () => {
    fixture.save.mockReturnValue(unwrapped(detail));
    renderPage();

    await userEvent.click(screen.getByText('Костюми'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Редагувати' }));
    // No markup is typed: the text opens in the visual editor with its formatting.
    expect(within(panel).getByRole('textbox', { name: 'Текст розділу' })).toHaveTextContent(
      'Шиємо самі.',
    );
    await userEvent.click(within(panel).getByRole('tab', { name: 'Російська' }));
    await userEvent.type(within(panel).getByRole('textbox', { name: 'Назва' }), 'Костюмы');
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    expect(fixture.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, revision: 4, parentId: 1, slug: 'kostyumy' }),
    );
    const input = fixture.save.mock.calls[0][0];
    expect(input.ru.name).toBe('Костюмы');
    expect(input.uk.text).toEqual(detail.uk.text);
  });

  it('deletes a category after a confirmation', async () => {
    fixture.remove.mockReturnValue(unwrapped(undefined));
    renderPage();

    await userEvent.click(screen.getByText('Костюми'));
    const panel = await screen.findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Видалити розділ' }));
    const confirm = await screen.findByRole('dialog', { name: 'Видалити розділ сайту?' });
    await userEvent.click(within(confirm).getByRole('button', { name: 'Видалити' }));

    expect(fixture.remove).toHaveBeenCalledWith(2);
    expect(await screen.findByText('Розділ «Костюми» видалено.')).toBeInTheDocument();
  });

  it('transfers old-site categories only after a check and «Перенести»', async () => {
    const items = [{ slug: 'specodyag', parentSlug: null, productUrls: ['/kostyum-lider/'] }];
    const counted = {
      dryRun: true,
      total: 1,
      created: 0,
      updated: 0,
      kept: 1,
      productLinks: 5,
      notMatched: [{ url: '/halat-gera/', name: null, reason: 'Немає товару.' }],
      problems: [],
    };
    fixture.transfer.mockImplementation(({ dryRun }: { dryRun: boolean }) =>
      unwrapped({ ...counted, dryRun }),
    );
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Перенести зі старого сайту' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Перенести розділи зі старого сайту',
    });
    await userEvent.upload(
      within(dialog).getByLabelText('Файл перенесення'),
      new File([JSON.stringify({ items })], 'categories.json', { type: 'application/json' }),
    );

    expect(
      await within(dialog).findByText(/Розділів у файлі: 1 .* Буде додано товарів у розділи: 5/),
    ).toBeInTheDocument();
    expect(fixture.transfer).toHaveBeenCalledTimes(1);
    expect(fixture.transfer).toHaveBeenLastCalledWith(
      expect.objectContaining({ items, dryRun: true, showOnSite: false, overwrite: false }),
    );
    // Only new products in existing categories are enough to transfer.
    await userEvent.click(within(dialog).getByRole('button', { name: 'Перенести' }));

    expect(await within(dialog).findByText('Розділи перенесено.')).toBeInTheDocument();
    expect(fixture.transfer).toHaveBeenLastCalledWith(expect.objectContaining({ dryRun: false }));
  });

  it('hides the transfer without the create right', () => {
    renderPage({ canCreate: false, canEdit: true, canDelete: false });

    expect(
      screen.queryByRole('button', { name: 'Перенести зі старого сайту' }),
    ).not.toBeInTheDocument();
  });
});
