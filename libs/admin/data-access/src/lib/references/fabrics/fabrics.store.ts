import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { FabricRow } from './fabrics.models';

@Injectable()
export class FabricsStore {
  readonly fabrics = httpResource<FabricRow[]>(() => '/api/reference/fabrics', {
    defaultValue: [],
  });
}
