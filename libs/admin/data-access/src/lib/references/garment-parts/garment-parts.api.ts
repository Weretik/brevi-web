import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { CreateGarmentPartRequest, UpdateGarmentPartRequest } from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class GarmentPartsApi {
  private readonly http = inject(HttpClient);

  create(request: CreateGarmentPartRequest): Observable<number> {
    return this.http.post<number>('/api/reference/garment-parts', request);
  }

  update(id: number, request: UpdateGarmentPartRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/garment-parts/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/garment-parts/${id}`);
  }
}
