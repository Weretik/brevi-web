import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { ApiError } from '../contracts/api-client-contract';

/** Every endpoint calls the typed `apiClient` in its `queryFn` through `apiCall`; there is no untyped base query. */
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: [
    'AccessRights',
    'PricingParameter',
    'PpeMarkupRule',
    'PriceSource',
    'Fabric',
    'GarmentAccessory',
    'GarmentPart',
    'GarmentPartOperation',
    'Media',
    'Product',
    'ProductCategory',
    'ProductSection',
    'FabricColor',
    'StaffAccount',
    'StaffProfile',
    'Supplier',
  ],
  endpoints: () => ({}),
});

export const baseApi = adminApi;
