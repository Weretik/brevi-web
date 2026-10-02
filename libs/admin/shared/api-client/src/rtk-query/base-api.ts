import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-base-query';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'AdditionalReference',
    'Fabric',
    'GarmentAccessory',
    'GarmentPart',
    'GarmentPartOperation',
    'Media',
    'Product',
    'ProductCategory',
    'Supplier',
  ],
  endpoints: () => ({}),
});

export const baseApi = adminApi;
