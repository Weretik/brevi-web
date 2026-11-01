import { createServer } from 'node:http';

import { createAdminApiStore } from '@admin/shared/api-client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { remindersApi } from './reminders.api';
import { taskResponse } from '../testing/reminder-fixtures';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));

const hits = new Map<string, number>();
const bodies: Record<string, unknown>[] = [];
const server = createServer(async (request, response) => {
  const path = (request.url ?? '').split('?')[0] ?? '';
  const key = `${request.method}:${path}`;
  hits.set(key, (hits.get(key) ?? 0) + 1);
  let body = '';
  for await (const chunk of request) body += String(chunk);
  if (body) bodies.push(JSON.parse(body) as Record<string, unknown>);
  response.setHeader('content-type', 'application/json');
  if (key === 'POST:/api/reminders/non-working-days' && bodies.at(-1)?.['date'] === '2026-12-31') {
    response.statusCode = 409;
    response.end(JSON.stringify(['Цей день уже позначено неробочим.']));
    return;
  }
  const payload: Record<string, unknown> = {
    'GET:/api/reminders/tasks': [taskResponse],
    'GET:/api/reminders/non-working-days': [],
    'POST:/api/reminders/non-working-days': { date: '2026-12-30', note: 'Вихідний' },
    'POST:/api/reminders/tasks': taskResponse,
  };
  response.end(JSON.stringify(payload[key] ?? {}));
});

describe('reminders HTTP/cache boundary', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address && typeof address !== 'string') runtime.port = address.port;
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  it('sends the task body and refreshes tasks after a day off changes', async () => {
    const store = createAdminApiStore();
    const tasks = store.dispatch(remindersApi.endpoints.getReminderTasks.initiate());
    const days = store.dispatch(remindersApi.endpoints.getNonWorkingDays.initiate());
    try {
      expect((await tasks.unwrap())[0]?.title).toBe('Декларація єдиного податку');
      await days.unwrap();

      await store
        .dispatch(
          remindersApi.endpoints.createReminderTask.initiate({
            title: 'ЄСВ',
            organization: 'ppBrevi',
            schedule: {
              periodicity: 'monthly',
              dueRule: 'dayOfMonth',
              day: 20,
              monthOffset: 0,
              leadDays: 5,
            },
            chatId: null,
            activeFrom: null,
            isEnabled: true,
          }),
        )
        .unwrap();
      expect(bodies.at(-1)).toEqual({
        title: 'ЄСВ',
        organization: 'ppBrevi',
        schedule: {
          periodicity: 'monthly',
          dueRule: 'dayOfMonth',
          day: 20,
          monthOffset: 0,
          leadDays: 5,
        },
        chatId: null,
        activeFrom: null,
        isEnabled: true,
      });
      await vi.waitFor(() => expect(hits.get('GET:/api/reminders/tasks')).toBe(2));

      await store
        .dispatch(
          remindersApi.endpoints.addNonWorkingDay.initiate({
            date: '2026-12-30',
            note: 'Вихідний',
          }),
        )
        .unwrap();
      await vi.waitFor(() => expect(hits.get('GET:/api/reminders/tasks')).toBe(3));
      expect(hits.get('GET:/api/reminders/non-working-days')).toBe(2);

      await expect(
        store
          .dispatch(
            remindersApi.endpoints.addNonWorkingDay.initiate({ date: '2026-12-31', note: null }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: 409, message: 'Цей день уже позначено неробочим.' });
    } finally {
      tasks.unsubscribe();
      days.unsubscribe();
      store.dispatch(remindersApi.util.resetApiState());
    }
  });
});
