import { render, screen } from '@testing-library/react';

import { getReturnsDictionary } from './i18n/returns-dictionary';
import { ReturnsGeneral } from './sections/returns-general';
import { ReturnsGroups } from './sections/returns-groups';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('returns dictionary', () => {
  it('has the same groups and items in both languages', () => {
    expect(shape(getReturnsDictionary('ru'))).toEqual(shape(getReturnsDictionary('uk')));
  });
});

describe('ReturnsGroups', () => {
  it('renders every group with its intro and titled items', () => {
    const { groups } = getReturnsDictionary('uk').conditions;
    render(<ReturnsGroups groups={groups} />);

    expect(screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent)).toEqual(
      groups.map((group) => group.title),
    );
    expect(screen.getByText('Повернення коштів.')).toBeTruthy();
    expect(screen.getByText(/займає трохи більше 7 робочих днів/)).toBeTruthy();
  });

  it('numbers the steps of the instruction', () => {
    render(<ReturnsGroups groups={getReturnsDictionary('uk').steps.groups} numbered />);

    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('03')).toBeTruthy();
  });
});

describe('ReturnsGeneral', () => {
  it('states the 14 days and links to the law in a new tab', () => {
    const dictionary = getReturnsDictionary('uk').general;
    render(<ReturnsGeneral dictionary={dictionary} />);

    expect(screen.getByText(/протягом 14 днів з моменту покупки/)).toBeTruthy();
    const link = screen.getByRole('link', { name: new RegExp(dictionary.lawLink) });
    expect(link.getAttribute('href')).toBe('https://zakon.rada.gov.ua/laws/show/1023-12');
    expect(link.getAttribute('rel')).toContain('nofollow');
  });
});
