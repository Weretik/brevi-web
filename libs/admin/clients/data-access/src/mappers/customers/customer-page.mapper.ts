import { mapCustomerSummary } from './customer-summary.mapper';
import { integer, items, record } from '../../validators/customers/customer-response';

import type { CustomerPage } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type PageResponse = operations['getCrmCustomers']['responses'][200]['content']['application/json'];
export function mapCustomerPage(value: unknown): CustomerPage {
  const row = record(value);
  const page = record(row['pagedInfo']);
  const info: PageResponse['pagedInfo'] = {
    pageNumber: integer(page['pageNumber']),
    pageSize: integer(page['pageSize']),
    totalRecords: integer(page['totalRecords'], 0),
    totalPages: integer(page['totalPages'], 0),
  };
  return {
    rows: items(row['value']).map(mapCustomerSummary),
    page: info.pageNumber,
    pageSize: info.pageSize,
    total: info.totalRecords,
    totalPages: info.totalPages,
  };
}
