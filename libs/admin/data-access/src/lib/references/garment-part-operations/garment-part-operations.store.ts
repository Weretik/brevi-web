import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { GarmentPartOperationRow } from './garment-part-operations.models';

@Injectable()
export class GarmentPartOperationsStore {
  readonly garmentPartOperations = httpResource<GarmentPartOperationRow[]>(
    () => '/api/reference/garment-part-operations',
    {
      defaultValue: [],
    },
  );
}
