import { describe, expect, it } from 'vitest';

import { toSaveTaskInput } from './task-input.mapper';
import { mapTaskDetail } from './task.mapper';

describe('task mappers', () => {
  it('orders steps and counts done ones', () => {
    const task = mapTaskDetail({
      id: 3,
      number: 'ЗД-0003',
      title: 'Передзвонити',
      description: null,
      status: 'InProgress',
      lane: 'Active',
      isUrgent: false,
      isOverdue: false,
      dueAt: '2026-11-05T10:00:00Z',
      assignee: { userId: 17, name: 'Ольга' },
      author: { userId: 1, name: 'Віталій' },
      customerPublicId: null,
      customerName: null,
      steps: [
        { id: 2, position: 1, text: 'Надіслати', isDone: false },
        { id: 1, position: 0, text: 'Розрахувати', isDone: true },
      ],
      history: [],
      completedAt: null,
      createdAt: '2026-11-04T10:00:00Z',
      updatedAt: '2026-11-04T10:00:00Z',
      version: 2,
    });
    expect(task.steps.map((x) => x.text)).toEqual(['Розрахувати', 'Надіслати']);
    expect([task.stepsDone, task.stepsTotal]).toEqual([1, 2]);
  });

  it('sends trimmed text, the client id and an ISO due time', () => {
    const body = toSaveTaskInput({
      version: 0,
      title: ' КП для кухні ',
      description: ' ',
      assigneeUserId: 17,
      dueDate: '2026-11-05',
      dueTime: '12:00',
      isUrgent: true,
      customer: { publicId: '6f9619ff-8b86-d011-b42d-00cf4fc964ff', name: 'Пузата хата' },
      steps: [{ key: 'a', text: ' Крок ', isDone: false }],
    });
    expect(body).toMatchObject({
      title: 'КП для кухні',
      description: null,
      customerPublicId: '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
      steps: [{ text: 'Крок', isDone: false }],
    });
    expect(body.dueAt).toBe(new Date(2026, 10, 5, 12, 0).toISOString());
  });
});
