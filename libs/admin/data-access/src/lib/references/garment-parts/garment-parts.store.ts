import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { GarmentPartRow } from './garment-parts.models';

@Injectable()
export class GarmentPartsStore {
  readonly garmentParts = httpResource<GarmentPartRow[]>(() => '/api/reference/garment-parts', {
    defaultValue: [],
  });
}
