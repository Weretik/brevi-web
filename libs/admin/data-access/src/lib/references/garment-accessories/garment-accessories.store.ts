import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { GarmentAccessoryRow } from './garment-accessories.models';

@Injectable()
export class GarmentAccessoriesStore {
  readonly garmentAccessories = httpResource<GarmentAccessoryRow[]>(
    () => '/api/reference/garment-accessories',
    {
      defaultValue: [],
    },
  );
}
