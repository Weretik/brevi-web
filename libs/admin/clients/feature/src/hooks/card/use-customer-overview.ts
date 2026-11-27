import { useGetEmbroideryCalculationsQuery } from '@admin/embroidery/data-access';
import { useGetProductionOrdersQuery } from '@admin/production/data-access';
import { emptyProductionOrderFilters } from '@admin/production/model';
import { useListQuotesQuery } from '@admin/quotes/data-access';
import { useListTasksQuery } from '@admin/tasks/data-access';

import type { CustomerCardAccess } from '../../clients.routes';

interface Args {
  customerPublicId: string;
  from?: string;
  to?: string;
  access: CustomerCardAccess;
}

/** «Огляд» of a client card: counts of every linked list in the period and the five latest КП. */
export function useCustomerOverview({ customerPublicId, from, to, access }: Args) {
  const quotes = useListQuotesQuery(
    { search: '', responsibleUserId: null, page: 1, pageSize: 5, customerPublicId, from, to },
    { skip: !access.quotes },
  );
  const orders = useGetProductionOrdersQuery(
    {
      search: '',
      status: null,
      manager: null,
      dueTo: null,
      stage: null,
      page: 1,
      pageSize: 1,
      customerPublicId,
      filters: { ...emptyProductionOrderFilters, from: from ?? null, to: to ?? null },
    },
    { skip: !access.productionOrders },
  );
  const tasks = useListTasksQuery(
    {
      search: '',
      filter: 'All',
      assigneeUserId: null,
      page: 1,
      pageSize: 1,
      customerPublicId,
      from,
      to,
    },
    { skip: !access.tasks },
  );
  const embroidery = useGetEmbroideryCalculationsQuery(
    { search: '', page: 1, pageSize: 1, customerPublicId, from, to },
    { skip: !access.embroidery },
  );
  return {
    recentQuotes: quotes.data?.items ?? [],
    quotesLoading: quotes.isFetching,
    quotesFailed: quotes.isError,
    counts: {
      quotes: quotes.data?.total,
      orders: orders.data?.total,
      tasks: tasks.data?.total,
      embroidery: embroidery.data?.total,
    },
  };
}
