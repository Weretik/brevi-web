import { render, screen } from '@testing-library/react';

import { getAgreementDictionary, getAgreementText } from './i18n/agreement-dictionary';
import { AgreementRequisites } from './sections/agreement-requisites';
import { AgreementSection } from './sections/agreement-section';

describe('agreement text', () => {
  it('has the same sections and clause numbers in both languages', () => {
    const uk = getAgreementText('uk');
    const ru = getAgreementText('ru');

    expect(uk.sections).toHaveLength(11);
    expect(ru.sections.map((section) => section.clauses.map((clause) => clause.number))).toEqual(
      uk.sections.map((section) => section.clauses.map((clause) => clause.number)),
    );
  });

  it('numbers clauses inside their section without gaps in the first level', () => {
    for (const section of getAgreementText('uk').sections) {
      expect(
        section.clauses.every((clause) => clause.number.startsWith(`${section.number}.`)),
      ).toBe(true);
      expect(new Set(section.clauses.map((clause) => clause.number)).size).toBe(
        section.clauses.length,
      );
    }
  });

  it('keeps the old phones out of the offer', () => {
    for (const locale of ['uk', 'ru'] as const) {
      const text = JSON.stringify(getAgreementText(locale));
      expect(text).not.toMatch(/307[\s-]?55[\s-]?54|612-234|611-232/);
    }
  });
});

describe('agreement blocks', () => {
  it('renders a section with its number, title, and every clause', () => {
    const [section] = getAgreementText('uk').sections;
    render(<AgreementSection section={section} />);

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(`01${section.title}`);
    expect(screen.getAllByRole('listitem')).toHaveLength(section.clauses.length);
    expect(screen.getByText('1.9.1.')).toBeTruthy();
  });

  it('shows the seller details with the site phone only', () => {
    const { container } = render(
      <AgreementRequisites dictionary={getAgreementDictionary('uk').requisites} locale="uk" />,
    );

    expect(container.textContent).toContain('35521636');
    expect(container.textContent).toContain('355216316015');
    expect(container.textContent).toContain('UA63 305299 00000 26004041206862');
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(container.textContent).not.toContain('0532');
  });
});
