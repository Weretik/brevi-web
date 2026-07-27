import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  CreateGarmentPartOperationRequest,
  UpdateGarmentPartOperationRequest,
} from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class GarmentPartOperationsApi {
  private readonly http = inject(HttpClient);

  create(request: CreateGarmentPartOperationRequest): Observable<number> {
    return this.http.post<number>('/api/reference/garment-part-operations', request);
  }

  update(id: number, request: UpdateGarmentPartOperationRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/garment-part-operations/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/garment-part-operations/${id}`);
  }
}
