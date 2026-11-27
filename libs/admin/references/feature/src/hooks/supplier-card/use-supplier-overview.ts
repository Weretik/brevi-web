import { useListProductsQuery } from '@admin/products/data-access';
import { useGetPurchaseInvoicesQuery } from '@admin/purchasing/data-access';
import { useGetFabricMovementsQuery } from '@admin/warehouse/data-access';
import { defaultFabricMovementQuery } from '@admin/warehouse/model';

import type { SupplierCardAccess } from '../../references.routes';

interface Args {
  supplierId: number;
  from?: string;
  to?: string;
  access: SupplierCardAccess;
}

/** «Огляд» of a supplier card: products, receipts and invoices of the period, counted by the server. */
export function useSupplierOverview({ supplierId, from, to, access }: Args) {
  const products = useListProductsQuery(
    { page: 1, pageSize: 10, supplierId },
    { skip: !access.products },
  );
  const receipts = useGetFabricMovementsQuery(
    {
      ...defaultFabricMovementQuery,
      kind: 'Receipt',
      supplierId,
      from: from ?? null,
      to: to ?? null,
    },
    { skip: !access.fabricStock },
  );
  const invoices = useGetPurchaseInvoicesQuery(
    {
      page: 1,
      pageSize: 1,
      search: '',
      filter: 'All',
      supplierId,
      documentFrom: from,
      documentTo: to,
    },
    { skip: !access.purchaseInvoices },
  );
  return {
    products: products.data?.pagedInfo.totalRecords,
    receipts: receipts.data?.total,
    invoices: invoices.data?.total,
  };
}
