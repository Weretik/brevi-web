import { parseCm, sizeFinderAnswers } from './size-answers';
import { getSizesDictionary } from '../i18n/sizes-dictionary';

const result = getSizesDictionary('uk').finder.result;
const empty = { gender: 'men' as const, chest: '', height: '', foot: '' };

describe('size finder answers', () => {
  it('reads centimetres with a comma or a dot and ignores empty or non-positive values', () => {
    expect(parseCm('95,5')).toBe(95.5);
    expect(parseCm('95.5')).toBe(95.5);
    expect(parseCm(' ')).toBeNull();
    expect(parseCm('0')).toBeNull();
    expect(parseCm('abc')).toBeNull();
  });

  it('gives nothing until a value is typed', () => {
    expect(sizeFinderAnswers({ ...empty, kind: 'clothing' }, result)).toEqual({
      outputs: [],
      outOfRange: false,
    });
  });

  it('answers the clothing size and the height group', () => {
    const answers = sizeFinderAnswers(
      { ...empty, kind: 'clothing', chest: '96', height: '176' },
      result,
    );
    expect(answers.outOfRange).toBe(false);
    expect(answers.outputs.map((output) => output.label)).toEqual([result.size, result.height]);
  });

  it('marks a foot length outside the chart', () => {
    expect(sizeFinderAnswers({ ...empty, kind: 'shoes', foot: '40' }, result)).toEqual({
      outputs: [],
      outOfRange: true,
    });
  });
});
