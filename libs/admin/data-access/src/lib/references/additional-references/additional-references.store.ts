import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { AdditionalReferenceRow } from './additional-references.models';

@Injectable()
export class AdditionalReferencesStore {
  readonly additionalReferences = httpResource<AdditionalReferenceRow[]>(
    () => '/api/reference/additional-references',
    {
      defaultValue: [],
    },
  );
}
