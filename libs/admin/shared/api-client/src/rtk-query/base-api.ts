import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-base-query';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
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
    'StaffAccount',
    'StaffProfile',
    'Supplier',
  ],
  endpoints: () => ({}),
});

export const baseApi = adminApi;
