export interface LoremRequest {
  theme: string;
  paragraphs: number;
  sentencesPerParagraph: number;
}

export interface LoremResponse {
  text: string;
  success: boolean;
  error?: string;
}
