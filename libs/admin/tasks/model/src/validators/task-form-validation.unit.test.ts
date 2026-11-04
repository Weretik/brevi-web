import { describe, expect, it } from 'vitest';

import { validateTaskForm } from './task-form-validation';
import { dueAtFromForm, emptyTaskForm } from '../forms/task-form';

describe('validateTaskForm', () => {
  const valid = {
    ...emptyTaskForm(new Date(2026, 10, 4)),
    title: 'Передзвонити',
    assigneeUserId: 17,
  };

  it('accepts a filled panel and defaults to tomorrow 18:00', () => {
    expect(validateTaskForm(valid)).toEqual({});
    expect(valid.dueDate).toBe('2026-11-05');
    expect(valid.dueTime).toBe('18:00');
  });

  it('names every missing or too long field', () => {
    const errors = validateTaskForm({
      ...valid,
      title: ' ',
      assigneeUserId: null,
      dueTime: '',
      steps: [{ key: 'a', text: ' ', isDone: false }],
    });
    expect(Object.keys(errors).sort()).toEqual(['assigneeUserId', 'due', 'steps', 'title']);
    expect(validateTaskForm({ ...valid, title: 'a'.repeat(201) }).title).toBeDefined();
  });

  it('turns local date and time into an ISO moment', () => {
    expect(dueAtFromForm({ dueDate: '2026-11-05', dueTime: '12:30' })).toBe(
      new Date(2026, 10, 5, 12, 30).toISOString(),
    );
    expect(dueAtFromForm({ dueDate: '05.11.2026', dueTime: '12:30' })).toBeNull();
  });
});
