import { describe, expect, it } from 'vitest';

import { fillQuoteMarks, unknownQuoteMarks } from './quote-template-marks';

const values = {
  '{quoteNumber}': '12-11-2026',
  '{managerName}': 'Ольга',
  '{managerPhone}': '+380 50 111 22 33',
  '{managerEmail}': 'olia@brevi.ua',
  '{site}': 'brevi.com.ua',
};

describe('quote template marks', () => {
  it('fills known marks and keeps unknown ones visible', () => {
    expect(fillQuoteMarks('КП № {quoteNumber} від {managerNmae}.', values)).toEqual([
      { kind: 'text', text: 'КП № ' },
      { kind: 'mark', mark: '{quoteNumber}', text: '12-11-2026' },
      { kind: 'text', text: ' від ' },
      { kind: 'unknown', text: '{managerNmae}' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('lists each unknown mark once and ignores braces with spaces', () => {
    expect(unknownQuoteMarks('{site} {x} {x} { not a mark }')).toEqual(['{x}']);
  });
});
