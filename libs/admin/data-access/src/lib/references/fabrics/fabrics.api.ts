import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { CreateFabricRequest, UpdateFabricRequest } from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class FabricsApi {
  private readonly http = inject(HttpClient);

  create(request: CreateFabricRequest): Observable<number> {
    return this.http.post<number>('/api/reference/fabrics', request);
  }

  update(id: number, request: UpdateFabricRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/fabrics/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/fabrics/${id}`);
  }
}
