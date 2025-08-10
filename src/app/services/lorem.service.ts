import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { LoremRequest, LoremResponse } from '../models/lorem.models';

@Injectable({ providedIn: 'root' })
export class LoremService {
  private readonly http = inject(HttpClient);

  generateLorem(request: LoremRequest): Observable<LoremResponse> {
    return this.http.post<LoremResponse>('/api/generate-lorem', { ...request, stream: false });
  }


  generateLoremStream(request: LoremRequest): Observable<string> {
    return new Observable(observer => {
      fetch('/api/generate-lorem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...request, stream: true })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (!response.body) {
          throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readChunk = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }

            const text = decoder.decode(value, { stream: true });
            observer.next(text);
            readChunk();
          }).catch(error => {
            observer.error(error);
          });
        };

        readChunk();
      })
      .catch(error => {
        observer.error(error);
      });

      // Cleanup function
      return () => {
        // Le reader sera automatiquement fermé quand le stream se termine
      };
    });
  }
}
