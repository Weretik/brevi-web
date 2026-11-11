import { fireEvent, render, screen } from '@testing-library/react';

import { findClothingSize, findHeightGroup, findShoeSize } from './data/size-chart';
import { getSizesDictionary } from './i18n/sizes-dictionary';
import { SizeChartSheet } from './sections/size-chart-sheet';
import { SizeFinder } from './sections/size-finder';
import { SizeTables } from './sections/size-tables';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('sizes dictionary', () => {
  it('has the same keys and steps in both languages', () => {
    expect(shape(getSizesDictionary('ru'))).toEqual(shape(getSizesDictionary('uk')));
    expect(getSizesDictionary('ru').measure.shoes.steps).toHaveLength(
      getSizesDictionary('uk').measure.shoes.steps.length,
    );
  });
});

describe('size lookup', () => {
  it('finds clothing sizes and rounds a gap up', () => {
    expect(findClothingSize('men', 90)?.size).toBe('44–46');
    expect(findClothingSize('men', 94.5)?.size).toBe('48–50');
    expect(findClothingSize('men', 130)).toBeNull();
    expect(findClothingSize('women', 130)?.size).toBe('64–66');
  });

  it('finds height groups and shoe sizes', () => {
    expect(findHeightGroup('women', 160)?.group).toBe('3–4');
    expect(findHeightGroup('men', 120)).toBeNull();
    expect(findShoeSize(24.2)?.size).toBe(38);
    expect(findShoeSize(20)?.size).toBe(34);
    expect(findShoeSize(30)).toBeNull();
  });
});

describe('SizeFinder', () => {
  it('shows the size for a chest girth typed with a comma', () => {
    render(<SizeFinder dictionary={getSizesDictionary('uk').finder} />);
    fireEvent.change(screen.getByLabelText('Обхват грудей, см'), { target: { value: '100,5' } });

    expect(screen.getByText('48–50')).toBeTruthy();
  });

  it('switches to shoes and warns about a value outside the chart', () => {
    render(<SizeFinder dictionary={getSizesDictionary('uk').finder} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Взуття' }));
    fireEvent.change(screen.getByLabelText('Довжина стопи, см'), { target: { value: '31' } });

    expect(screen.getByText(/Таких вимірів немає/)).toBeTruthy();
  });
});

describe('SizeTables', () => {
  it('renders five tables with the shoe chart and four without it', () => {
    const { rerender } = render(<SizeTables dictionary={getSizesDictionary('uk').tables} />);
    expect(screen.getAllByRole('table')).toHaveLength(5);

    rerender(<SizeTables dictionary={getSizesDictionary('uk').tables} showShoes={false} />);
    expect(screen.getAllByRole('table')).toHaveLength(4);
  });
});

describe('SizeChartSheet', () => {
  it('opens the panel with the finder and the tables from the button', () => {
    render(<SizeChartSheet dictionary={getSizesDictionary('uk')} fullPageHref="/uk/size-chart" />);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Таблиця розмірів' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getAllByRole('table')).toHaveLength(5);
    expect(screen.getByRole('link', { name: /Повна сторінка/ }).getAttribute('href')).toBe(
      '/uk/size-chart',
    );
  });
});
