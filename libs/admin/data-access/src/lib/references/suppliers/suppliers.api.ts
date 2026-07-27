import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { CreateSupplierRequest, UpdateSupplierRequest } from '@admin/contracts';

@Injectable({ providedIn: 'root' })
export class SuppliersApi {
  private readonly http = inject(HttpClient);

  create(request: CreateSupplierRequest): Observable<number> {
    return this.http.post<number>('/api/reference/suppliers', request);
  }

  update(id: number, request: UpdateSupplierRequest): Observable<void> {
    return this.http.put<void>(`/api/reference/suppliers/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reference/suppliers/${id}`);
  }
}
