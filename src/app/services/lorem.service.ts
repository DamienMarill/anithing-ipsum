import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { LoremRequest, LoremResponse } from '../models/lorem.models';

@Injectable({ providedIn: 'root' })
export class LoremService {
  private readonly http = inject(HttpClient);

  generateLorem(request: LoremRequest): Observable<LoremResponse> {
    return this.http.post<LoremResponse>('/api/generate-lorem', request);
  }
}
