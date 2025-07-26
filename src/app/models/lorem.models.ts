export interface LoremRequest {
  theme: string;
  paragraphs: number;
  paragraphLength: 'court' | 'moyen' | 'long' | 'variable';
}

export interface LoremResponse {
  text: string;
  success: boolean;
  error?: string;
}
