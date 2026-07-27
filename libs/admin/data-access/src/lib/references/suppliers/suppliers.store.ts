import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { SupplierRow } from './suppliers.models';

@Injectable()
export class SuppliersStore {
  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });
}
