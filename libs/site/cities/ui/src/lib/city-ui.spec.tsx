import { COMPANY } from '@site/core/config';
import { render, screen, within } from '@testing-library/react';

import { getCityDictionary } from './i18n/city-dictionary';
import { CityFaq } from './sections/city-faq';
import { CityHero } from './sections/city-hero';
import { CityLinks } from './sections/city-links';
import { CityOrder } from './sections/city-order';
import { CityPoints } from './sections/city-points';

describe('city page sections', () => {
  it('names the city in the h1 and keeps the request out of search results', () => {
    const dictionary = getCityDictionary('uk');
    render(
      <CityHero
        company={COMPANY}
        dictionary={dictionary}
        label={dictionary.kinds.sewing.label}
        title={dictionary.kinds.sewing.title('у Харкові')}
        intro={['Перший абзац.', 'Другий абзац.']}
        facts={dictionary.kinds.sewing.facts}
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        requestHref="/uk/request"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Пошиття спецодягу на замовлення у Харкові',
    );
    const request = screen.getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('rel')).toBe('nofollow');
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(within(screen.getByLabelText('Умови')).getByText('від 5 одиниць')).toBeTruthy();
  });

  it('numbers steps only when asked', () => {
    const items = [
      { title: 'Заявка', text: 'а' },
      { title: 'Зразок', text: 'б' },
    ];
    const { rerender } = render(<CityPoints items={items} numbered />);
    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(screen.getByText('02')).toBeTruthy();

    rerender(<CityPoints items={items} />);
    expect(screen.getByRole('list').tagName).toBe('UL');
    expect(screen.queryByText('02')).toBeNull();
  });

  it('keeps every answer in the HTML under its question', () => {
    const { container } = render(
      <CityFaq items={[{ question: 'Скільки йде доставка?', answer: 'Один-два дні.' }]} />,
    );
    expect(container.querySelector('summary')?.textContent).toBe('Скільки йде доставка?');
    expect(screen.getByText('Один-два дні.')).toBeTruthy();
  });

  it('links to nearby cities, the pair page and «Регіони»', () => {
    render(
      <CityLinks
        neighbours={[{ name: 'Полтава', href: '/uk/sewing/poltava' }]}
        pair={{ name: 'Робочий одяг у Харкові', href: '/uk/workwear/kharkiv' }}
        regions={{ name: 'Доставка в інші міста', href: '/uk/regions' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Полтава' }).getAttribute('href')).toBe(
      '/uk/sewing/poltava',
    );
    expect(screen.getByRole('link', { name: /Робочий одяг у Харкові/ }).getAttribute('href')).toBe(
      '/uk/workwear/kharkiv',
    );
    expect(screen.getByRole('link', { name: /Доставка в інші міста/ }).getAttribute('href')).toBe(
      '/uk/regions',
    );
  });

  it('closes the page with the call to order in Russian', () => {
    const dictionary = getCityDictionary('ru');
    render(
      <CityOrder
        company={COMPANY}
        id="city-order"
        index="09"
        title={dictionary.kinds.workwear.order('в Одессе')}
        dictionary={dictionary}
        requestHref="/ru/request"
      />,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      'Подберём рабочую одежду для команды в Одессе',
    );
    expect(screen.getByText('09 · Заказ')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Оставить заявку' }).getAttribute('rel')).toBe(
      'nofollow',
    );
  });
});
