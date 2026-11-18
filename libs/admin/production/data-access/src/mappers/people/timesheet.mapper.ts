import {
  boolean,
  dateTime,
  day,
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  record,
  text,
} from '../../validators/production-response';

import type { TimesheetDay } from '@admin/production/model';

export function mapTimesheetDay(value: unknown): TimesheetDay {
  const source = record(value, 'табель');
  const month = record(source['month'], 'місяць табеля');
  return {
    date: day(source['date'], 'дата'),
    canEdit: boolean(source['canEdit'], 'можна змінювати'),
    isMonthClosed: boolean(source['isMonthClosed'], 'місяць закрито'),
    rows: list(source['rows'], 'працівники').map((item) => {
      const row = record(item, 'рядок табеля');
      return {
        employeeId: integer(row['employeeId'], 'id працівника', 1),
        name: nonEmptyText(row['name'], 'працівник'),
        position: text(row['position'], 'посада'),
        isActive: boolean(row['isActive'], 'працює'),
        minutes: nullableInteger(row['minutes'], 'хвилини'),
        version: nullableInteger(row['version'], 'версія', 1),
      };
    }),
    changes: list(source['changes'], 'історія змін').map((item) => {
      const change = record(item, 'зміна табеля');
      return {
        id: integer(change['id'], 'id зміни', 1),
        employeeId: integer(change['employeeId'], 'id працівника', 1),
        employeeName: nonEmptyText(change['employeeName'], 'працівник'),
        beforeMinutes: nullableInteger(change['beforeMinutes'], 'було'),
        afterMinutes: integer(change['afterMinutes'], 'стало'),
        changedAt: dateTime(change['changedAt'], 'час зміни'),
        changedByName: nonEmptyText(change['changedByName'], 'хто змінив'),
      };
    }),
    month: {
      month: text(month['month'], 'місяць'),
      days: list(month['days'], 'дні').map((item) => {
        const row = record(item, 'день');
        return {
          date: day(row['date'], 'дата'),
          people: integer(row['people'], 'людей'),
          minutes: integer(row['minutes'], 'хвилини'),
        };
      }),
      employees: list(month['employees'], 'працівники місяця').map((item) => {
        const row = record(item, 'працівник місяця');
        return {
          employeeId: integer(row['employeeId'], 'id працівника', 1),
          name: nonEmptyText(row['name'], 'працівник'),
          position: text(row['position'], 'посада'),
          days: integer(row['days'], 'днів'),
          minutes: integer(row['minutes'], 'хвилини'),
        };
      }),
    },
  };
}
