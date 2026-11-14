import {
  boolean,
  dateTime,
  integer,
  list,
  nonEmptyText,
  record,
} from '../../validators/production-response';

import type { WorkshopEmployee } from '@admin/production/model';

export function mapWorkshopEmployee(value: unknown): WorkshopEmployee {
  const row = record(value, 'працівник');
  return {
    id: integer(row['id'], 'id працівника', 1),
    fullName: nonEmptyText(row['fullName'], 'ПІБ'),
    position: nonEmptyText(row['position'], 'посада'),
    isActive: boolean(row['isActive'], 'стан працівника'),
    updatedAt: dateTime(row['updatedAt'], 'час зміни'),
  };
}

export const mapWorkshopStaff = (value: unknown): WorkshopEmployee[] =>
  list(value, 'список працівників').map(mapWorkshopEmployee);
