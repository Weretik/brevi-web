import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  CreateAdditionalReferenceRequest,
  UpdateAdditionalReferenceRequest,
} from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class AdditionalReferencesApi {
  private readonly http = inject(HttpClient);

  create(request: CreateAdditionalReferenceRequest): Observable<number> {
    return this.http.post<number>('/api/reference/additional-references', request);
  }

  update(id: number, request: UpdateAdditionalReferenceRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/additional-references/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/additional-references/${id}`);
  }
}
