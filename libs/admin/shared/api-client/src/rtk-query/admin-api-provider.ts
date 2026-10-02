import { configureStore } from '@reduxjs/toolkit';
import { createElement } from 'react';
import { Provider } from 'react-redux';

import { adminApi } from './base-api';

import type { PropsWithChildren } from 'react';

export function createAdminApiStore() {
  return configureStore({
    reducer: { [adminApi.reducerPath]: adminApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApi.middleware),
  });
}

const adminStore = createAdminApiStore();

export function resetAdminApiState(): void {
  adminStore.dispatch(adminApi.util.resetApiState());
}

export function AdminApiProvider({ children }: PropsWithChildren) {
  return createElement(Provider, { store: adminStore, children });
}
