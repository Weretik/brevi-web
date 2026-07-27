import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  CreateGarmentAccessoryRequest,
  UpdateGarmentAccessoryRequest,
} from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class GarmentAccessoriesApi {
  private readonly http = inject(HttpClient);

  create(request: CreateGarmentAccessoryRequest): Observable<number> {
    return this.http.post<number>('/api/reference/garment-accessories', request);
  }

  update(id: number, request: UpdateGarmentAccessoryRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/garment-accessories/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/garment-accessories/${id}`);
  }
}
