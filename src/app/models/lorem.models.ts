export type GenerationType = 'paragraphs' | 'sentences' | 'words' | 'characters' | 'list';

export interface ParagraphConfig {
  count: number;
  length: 'court' | 'moyen' | 'long' | 'variable';
}

export interface SentenceConfig {
  count: number;
  length: 'court' | 'moyen' | 'long' | 'variable';
}

export interface WordConfig {
  count: number;
}

export interface CharacterConfig {
  count: number;
}

export interface ListConfig {
  items: number;
  separator: ' ' | ', ' | ' - ' | '\n';
  format: 'simple' | 'bullet' | 'numbered' | 'dash';
}

export interface LoremRequest {
  theme: string;
  type: GenerationType;
  config: ParagraphConfig | SentenceConfig | WordConfig | CharacterConfig | ListConfig;
}

export interface LoremResponse {
  text: string;
  success: boolean;
  error?: string;
}
