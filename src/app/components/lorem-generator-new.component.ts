import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoremService} from '../services/lorem.service';
import type {
  LoremRequest, 
  GenerationType,
  ParagraphConfig,
  SentenceConfig,
  WordConfig,
  CharacterConfig,
  ListConfig
} from '../models/lorem.models';

// Interface temporaire pour la compatibilité avec l'ancien service
interface LegacyLoremRequest {
  theme: string;
  paragraphs: number;
  paragraphLength: 'court' | 'moyen' | 'long' | 'variable';
}

interface TabConfig {
  id: GenerationType;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-lorem-generator-new',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-6xl leading-16 md:leading-20 font-bold bg-grad-clip text-transparent">Anything Ipsum</h1>
          <h2 class="text-lg md:text-2xl font-bold bg-grad-clip text-transparent mb-2">
            Générateur de Lorem Ipsum Thématique
          </h2>
          <p class="text-base md:text-lg text-color max-w-xl mx-auto">
            Créez du texte de remplissage personnalisé sur n'importe quel thème.
            Parfait pour vos maquettes, prototypes et projets de design.
          </p>
        </div>

        <!-- Formulaire -->
        <div class="mb-8">
          <div class="bg-base rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <!-- Header du formulaire -->
            <div class="bg-grad px-6 py-4">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-white">Paramètres de génération</h3>
              </div>
            </div>

            <div class="p-6">
              <!-- Theme Input (global) -->
              <div class="mb-8">
                <label for="theme" class="block text-sm font-medium text-color mb-2">
                  Thème du lorem ipsum
                </label>
                <input
                  id="theme"
                  type="text"
                  [formControl]="themeForm"
                  placeholder="Ex: pirates, cuisine française, space, medieval..."
                  class="w-full input"
                  [class.border-red-500]="themeForm.invalid && themeForm.touched"
                />
                @if (themeForm.invalid && themeForm.touched) {
                  <p class="mt-1 text-sm text-red-600">Le thème est requis</p>
                }
              </div>

              <!-- Tabs Navigation -->
              <div class="border-b border-gray-200 dark:border-gray-600 mb-6">
                <nav class="-mb-px flex space-x-8 overflow-x-auto">
                  @for (tab of tabs; track tab.id) {
                    <button
                      type="button"
                      (click)="setActiveTab(tab.id)"
                      [class]="activeTab() === tab.id 
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
                      class="group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors"
                    >
                      <svg 
                        [class]="activeTab() === tab.id 
                          ? 'text-purple-500 dark:text-purple-400' 
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'"
                        class="w-5 h-5 mr-2 transition-colors"
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path [attr.d]="tab.icon"></path>
                      </svg>
                      {{ tab.label }}
                    </button>
                  }
                </nav>
              </div>

              <!-- Tab Content -->
              <form [formGroup]="mainForm" (ngSubmit)="onSubmit($event)" novalidate class="space-y-6">
                
                <!-- Paragraphs Tab -->
                @if (activeTab() === 'paragraphs') {
                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTabDescription('paragraphs') }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Nombre de paragraphes -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-2">
                          Nombre de paragraphes
                        </label>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            (click)="incrementValue('paragraphs', 'count', -1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading() || (paragraphForm.get('count')?.value || 1) <= 1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="1"
                            [formControl]="paragraphForm.controls.count"
                            class="flex-1 text-center input"
                          />
                          <button
                            type="button"
                            (click)="incrementValue('paragraphs', 'count', 1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading()"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Longueur des paragraphes -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Longueur des paragraphes
                        </label>
                        <div class="space-y-2">
                          @for (option of getLengthOptions(); track option.value) {
                            <label class="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                [value]="option.value"
                                [formControl]="paragraphForm.controls.length"
                                class="radio"
                              />
                              <div class="flex-1">
                                <div class="text-sm font-medium text-color">{{ option.label }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ option.description }}</div>
                              </div>
                            </label>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Sentences Tab -->
                @if (activeTab() === 'sentences') {
                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTabDescription('sentences') }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Nombre de phrases -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-2">
                          Nombre de phrases
                        </label>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            (click)="incrementValue('sentences', 'count', -1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading() || (sentenceForm.get('count')?.value || 1) <= 1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="1"
                            [formControl]="sentenceForm.controls.count"
                            class="flex-1 text-center input"
                          />
                          <button
                            type="button"
                            (click)="incrementValue('sentences', 'count', 1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading()"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Plage de mots par phrase -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Mots par phrase
                        </label>
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min</label>
                            <input
                              type="number"
                              min="3"
                              value="3"
                              readonly
                              class="w-full input text-center"
                            />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max</label>
                            <input
                              type="number"
                              min="5"
                              value="15"
                              readonly
                              class="w-full input text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Words Tab -->
                @if (activeTab() === 'words') {
                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTabDescription('words') }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Nombre de mots -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-2">
                          Nombre de mots
                        </label>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            (click)="incrementValue('words', 'count', -5)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading() || (wordForm.get('count')?.value || 5) <= 5"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="5"
                            step="5"
                            [formControl]="wordForm.controls.count"
                            class="flex-1 text-center input"
                          />
                          <button
                            type="button"
                            (click)="incrementValue('words', 'count', 5)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading()"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Séparateur -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Séparateur
                        </label>
                        <div class="space-y-2">
                          @for (option of getSeparatorOptions(); track option.value) {
                            <label class="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                [value]="option.value"
                                name="word-separator"
                                value="space"
                                class="radio"
                              />
                              <div class="flex-1">
                                <div class="text-sm font-medium text-color">{{ option.label }}</div>
                              </div>
                            </label>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Characters Tab -->
                @if (activeTab() === 'characters') {
                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTabDescription('characters') }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Nombre de caractères -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-2">
                          Nombre de caractères
                        </label>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            (click)="incrementValue('characters', 'count', -50)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading() || (characterForm.get('count')?.value || 50) <= 50"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="50"
                            step="50"
                            [formControl]="characterForm.controls.count"
                            class="flex-1 text-center input"
                          />
                          <button
                            type="button"
                            (click)="incrementValue('characters', 'count', 50)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading()"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Options -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Options
                        </label>
                        <div class="space-y-2">
                          <label class="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked="true"
                              class="checkbox"
                            />
                            <div class="flex-1">
                              <div class="text-sm font-medium text-color">Inclure les espaces</div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Compter les espaces dans le total</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- List Tab -->
                @if (activeTab() === 'list') {
                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTabDescription('list') }}</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Nombre d'éléments -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-2">
                          Nombre d'éléments
                        </label>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            (click)="incrementValue('list', 'count', -1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading() || (listForm.get('count')?.value || 1) <= 1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="1"
                            [formControl]="listForm.controls.items"
                            class="flex-1 text-center input"
                          />
                          <button
                            type="button"
                            (click)="incrementValue('list', 'count', 1)"
                            class="flex items-center justify-center w-10 h-10 secondary"
                            [disabled]="isLoading()"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Format de liste -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Format
                        </label>
                        <div class="space-y-2">
                          @for (option of getListFormatOptions(); track option.value) {
                            <label class="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                [value]="option.value"
                                [formControl]="listForm.controls.format"
                                class="radio"
                              />
                              <div class="flex-1">
                                <div class="text-sm font-medium text-color">{{ option.label }}</div>
                              </div>
                            </label>
                          }
                        </div>
                      </div>

                      <!-- Longueur des éléments -->
                      <div>
                        <label class="block text-sm font-medium text-color mb-3">
                          Longueur des éléments
                        </label>
                        <div class="space-y-2">
                          @for (option of getLengthOptions(); track option.value) {
                            <label class="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                [value]="option.value"
                                value="moyen"
                                class="radio"
                              />
                              <div class="flex-1">
                                <div class="text-sm font-medium text-color">{{ option.label }}</div>
                              </div>
                            </label>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="!isFormValid() || isLoading()"
                  (click)="onSubmit($event)"
                  class="w-full bg-grad"
                >
                  @if (isLoading()) {
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération en cours...
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    Générer le lorem ipsum
                  }
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Result -->
        @if (result() || error()) {
          <div class="rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            @if (error()) {
              <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ error() }}</p>
                  </div>
                </div>
              </div>
            } @else if (result()) {
              <div class="bg-grad px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">
                    {{ currentTheme() }} Ipsum
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="flex items-center gap-2 light text-sm font-medium"
                  >
                    @if (copied()) {
                      <svg class="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"></path>
                      </svg>
                      Copié !
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      Copier
                    }
                  </button>
                </div>
              </div>

              <div class="p-6 bg-base">
                <div class="prose prose-gray max-w-none text-color leading-relaxed whitespace-pre-line">
                  {{ result() }}
                  @if (isLoading() && result()) {
                    <span class="animate-pulse text-purple-500">|</span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LoremGeneratorNewComponent {
  private readonly loremService = inject(LoremService);

  // Signals pour l'état du composant
  readonly isLoading = signal(false);
  readonly result = signal<string>('');
  readonly error = signal<string>('');
  readonly currentTheme = signal<string>('');
  readonly copied = signal(false);
  readonly activeTab = signal<GenerationType>('paragraphs');

  // Configuration des onglets
  readonly tabs: TabConfig[] = [
    {
      id: 'paragraphs',
      label: 'Paragraphes',
      icon: 'M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z',
      description: 'Générer par nombre de paragraphes'
    },
    {
      id: 'sentences', 
      label: 'Phrases',
      icon: 'M3 12h18v2H3v-2zm0-4h18v2H3V8zm0 8h12v2H3v-2z',
      description: 'Générer par nombre de phrases'
    },
    {
      id: 'words',
      label: 'Mots',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      description: 'Générer par nombre de mots'
    },
    {
      id: 'characters',
      label: 'Caractères', 
      icon: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
      description: 'Générer par nombre de caractères'
    },
    {
      id: 'list',
      label: 'Liste',
      icon: 'M4 8h4V4H4v4zm6 12h10v-2H10v2zm0-4h10v-2H10v2zm0-4h10v-2H10v2zm0-4h10V6H10v2zM4 20h4v-4H4v4zm0-6h4v-4H4v4z',
      description: 'Générer une liste d\'éléments'
    }
  ];

  // Formulaire principal
  readonly mainForm = new FormGroup({
    theme: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  // Formulaires pour chaque type
  readonly themeForm = this.mainForm.controls.theme;

  // Formulaires spécifiques par onglet avec presets
  readonly paragraphForm = new FormGroup({
    count: new FormControl(3, {nonNullable: true}),
    length: new FormControl('moyen' as const, {nonNullable: true})
  });

  readonly sentenceForm = new FormGroup({
    count: new FormControl(5, {nonNullable: true}),
    length: new FormControl('moyen' as const, {nonNullable: true})
  });

  readonly wordForm = new FormGroup({
    count: new FormControl(25, {nonNullable: true})
  });

  readonly characterForm = new FormGroup({
    count: new FormControl(500, {nonNullable: true})
  });

  readonly listForm = new FormGroup({
    items: new FormControl(8, {nonNullable: true}),
    separator: new FormControl(' ' as const, {nonNullable: true}),
    format: new FormControl('simple' as const, {nonNullable: true})
  });

  // Méthodes utilitaires
  setActiveTab(tab: GenerationType): void {
    this.activeTab.set(tab);
  }

  getTabDescription(tab: GenerationType): string {
    return this.tabs.find(t => t.id === tab)?.description || '';
  }

  getLengthOptions() {
    return [
      {
        value: 'court' as const,
        label: 'Court',
        description: '1-10 phrases par paragraphe'
      },
      {
        value: 'moyen' as const,
        label: 'Moyen',
        description: '10-20 phrases par paragraphe'
      },
      {
        value: 'long' as const,
        label: 'Long',
        description: '20-30 phrases par paragraphe'
      },
      {
        value: 'variable' as const,
        label: 'Variable',
        description: 'Longueur aléatoire par paragraphe'
      }
    ];
  }

  incrementValue(tab: GenerationType, field: string, delta: number): void {
    if (this.isLoading()) return;
    
    switch (tab) {
      case 'paragraphs':
        const paragraphControl = this.paragraphForm.get(field);
        if (paragraphControl) {
          const newValue = Math.max(1, paragraphControl.value + delta);
          paragraphControl.setValue(newValue);
        }
        break;
        
      case 'sentences':
        const sentenceControl = this.sentenceForm.get(field);
        if (sentenceControl) {
          const newValue = Math.max(1, sentenceControl.value + delta);
          sentenceControl.setValue(newValue);
        }
        break;
        
      case 'words':
        const wordControl = this.wordForm.get(field);
        if (wordControl) {
          const newValue = Math.max(5, wordControl.value + delta);
          wordControl.setValue(newValue);
        }
        break;
        
      case 'characters':
        const characterControl = this.characterForm.get(field);
        if (characterControl) {
          const newValue = Math.max(50, characterControl.value + delta);
          characterControl.setValue(newValue);
        }
        break;
        
      case 'list':
        const listControl = this.listForm.get(field);
        if (listControl) {
          const newValue = Math.max(1, listControl.value + delta);
          listControl.setValue(newValue);
        }
        break;
    }
  }

  getSeparatorOptions() {
    return [
      { value: ' ' as const, label: 'Espace' },
      { value: ', ' as const, label: 'Virgule + espace' },
      { value: ' - ' as const, label: 'Tiret + espaces' },
      { value: '\n' as const, label: 'Retour à la ligne' }
    ];
  }

  getListFormatOptions() {
    return [
      { value: 'bullet' as const, label: '• Puces' },
      { value: 'numbered' as const, label: '1. Numérotée' },
      { value: 'dash' as const, label: '- Tirets' }
    ];
  }

  isFormValid(): boolean {
    return this.themeForm.valid;
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    if (!this.isFormValid()) return;

    const theme = this.themeForm.value.trim();
    const activeTabType = this.activeTab();
    
    this.isLoading.set(true);
    this.error.set('');
    this.result.set('');
    this.currentTheme.set(theme);

    // Construire la requête selon le type d'onglet actif
    let request: LoremRequest;
    
    switch (activeTabType) {
      case 'paragraphs':
        request = {
          theme,
          type: 'paragraphs',
          config: {
            count: this.paragraphForm.get('count')?.value || 3,
            length: this.paragraphForm.get('length')?.value || 'moyen'
          } as ParagraphConfig
        };
        break;
        
      case 'sentences':
        request = {
          theme,
          type: 'sentences',
          config: {
            count: this.sentenceForm.get('count')?.value || 5,
            length: this.sentenceForm.get('length')?.value || 'moyen'
          } as SentenceConfig
        };
        break;
        
      case 'words':
        request = {
          theme,
          type: 'words',
          config: {
            count: this.wordForm.get('count')?.value || 50,
            // separator: ' ' // Valeur par défaut
          } as WordConfig
        };
        break;
        
      case 'characters':
        request = {
          theme,
          type: 'characters',
          config: {
            count: this.characterForm.get('count')?.value || 500,
            // includeSpaces: true // Simplification pour l'instant
          } as CharacterConfig
        };
        break;
        
      case 'list':
        request = {
          theme,
          type: 'list',
          config: {
            items: this.listForm.get('items')?.value || 8,
            format: this.listForm.get('format')?.value || 'bullet',
            // itemLength: 'moyen' // Simplification pour l'instant
          } as ListConfig
        };
        break;
        
      default:
        this.isLoading.set(false);
        this.error.set('Type de génération non supporté');
        return;
    }

    // Convertir en format legacy pour le moment
    const legacyRequest: LegacyLoremRequest = this.convertToLegacyFormat(request);

    let accumulatedText = '';
    
    this.loremService.generateLoremStream(legacyRequest).subscribe({
      next: (chunk) => {
        accumulatedText += chunk;
        this.result.set(accumulatedText);
      },
      complete: () => {
        this.isLoading.set(false);
        this.error.set('');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Erreur de connexion au serveur');
        this.result.set('');
        console.error('Erreur:', err);
      }
    });
  }

  private convertToLegacyFormat(request: LoremRequest): LegacyLoremRequest {
    // Pour l'instant, on convertit tout en format paragraphes
    // TODO: Adapter le backend pour supporter tous les types
    
    switch (request.type) {
      case 'paragraphs':
        const paragraphConfig = request.config as ParagraphConfig;
        return {
          theme: request.theme,
          paragraphs: paragraphConfig.count,
          paragraphLength: paragraphConfig.length
        };
        
      case 'sentences':
        const sentenceConfig = request.config as SentenceConfig;
        // Convertir les phrases en paragraphes (approximation)
        return {
          theme: request.theme,
          paragraphs: Math.ceil(sentenceConfig.count / 3), // ~3 phrases par paragraphe
          paragraphLength: 'moyen'
        };
        
      case 'words':
        const wordConfig = request.config as WordConfig;
        // Convertir les mots en paragraphes (approximation)
        return {
          theme: request.theme,
          paragraphs: Math.ceil(wordConfig.count / 100), // ~100 mots par paragraphe
          paragraphLength: 'long'
        };
        
      case 'characters':
        const characterConfig = request.config as CharacterConfig;
        // Convertir les caractères en paragraphes (approximation)
        return {
          theme: request.theme,
          paragraphs: Math.ceil(characterConfig.count / 500), // ~500 caractères par paragraphe
          paragraphLength: 'moyen'
        };
        
      case 'list':
        const listConfig = request.config as ListConfig;
        // Convertir la liste en paragraphes
        return {
          theme: request.theme,
          paragraphs: listConfig.items,
          paragraphLength: 'court' // Valeur par défaut pour les listes
        };
        
      default:
        return {
          theme: request.theme,
          paragraphs: 3,
          paragraphLength: 'moyen'
        };
    }
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.result());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }
}