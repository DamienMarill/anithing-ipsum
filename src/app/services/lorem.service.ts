import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { 
  LoremRequest, 
  LoremResponse, 
  ParagraphConfig,
  SentenceConfig,
  WordConfig,
  CharacterConfig,
  ListConfig
} from '../models/lorem.models';

// Interface temporaire pour la compatibilité
interface LegacyLoremRequest {
  theme: string;
  paragraphs: number;
  paragraphLength: 'court' | 'moyen' | 'long' | 'variable';
}

@Injectable({ providedIn: 'root' })
export class LoremService {
  private readonly http = inject(HttpClient);

  generateLorem(request: LoremRequest): Observable<LoremResponse> {
    return this.http.post<LoremResponse>('/api/generate-lorem', { ...request, stream: false });
  }


  // Surcharge pour la compatibilité avec l'ancien format
  generateLoremStream(request: LegacyLoremRequest): Observable<string>;
  generateLoremStream(request: LoremRequest): Observable<string>;
  generateLoremStream(request: LoremRequest | LegacyLoremRequest): Observable<string> {
    return new Observable(observer => {
      fetch('/api/generate-lorem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ...this.normalizeRequest(request), 
          stream: true 
        })
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

  // Normalise la requête pour la rendre compatible avec le backend
  private normalizeRequest(request: LoremRequest | LegacyLoremRequest): any {
    // Si c'est déjà au format legacy (ancien format)
    if ('paragraphs' in request) {
      return request;
    }
    
    // Convertir le nouveau format vers l'ancien pour l'instant
    const newRequest = request as LoremRequest;
    
    // Conversion basée sur le type de génération
    switch (newRequest.type) {
      case 'paragraphs':
        const paragraphConfig = newRequest.config as ParagraphConfig;
        return {
          theme: newRequest.theme,
          paragraphs: paragraphConfig.count,
          paragraphLength: paragraphConfig.length || 'moyen'
        };
        
      case 'sentences':
        // Conversion: estimer le nombre de paragraphes selon les phrases
        const sentenceConfig = newRequest.config as SentenceConfig;
        const paragraphsFromSentences = Math.ceil(sentenceConfig.count / 3);
        return {
          theme: newRequest.theme,
          paragraphs: paragraphsFromSentences,
          paragraphLength: sentenceConfig.length || 'moyen'
        };
        
      case 'words':
        // Conversion: estimer le nombre de paragraphes selon les mots (env. 75 mots par paragraphe moyen)
        const wordConfig = newRequest.config as WordConfig;
        const paragraphsFromWords = Math.ceil(wordConfig.count / 75);
        return {
          theme: newRequest.theme,
          paragraphs: Math.max(1, paragraphsFromWords),
          paragraphLength: 'moyen'
        };
        
      case 'characters':
        // Conversion: estimer le nombre de paragraphes selon les caractères (env. 400 chars par paragraphe)
        const charConfig = newRequest.config as CharacterConfig;
        const paragraphsFromChars = Math.ceil(charConfig.count / 400);
        return {
          theme: newRequest.theme,
          paragraphs: Math.max(1, paragraphsFromChars),
          paragraphLength: 'court'
        };
        
      case 'list':
        // Pour les listes, on génère autant de paragraphes que d'éléments
        const listConfig = newRequest.config as ListConfig;
        return {
          theme: newRequest.theme,
          paragraphs: listConfig.items,
          paragraphLength: 'court'
        };
        
      default:
        return {
          theme: newRequest.theme,
          paragraphs: 3,
          paragraphLength: 'moyen'
        };
    }
  }
}
