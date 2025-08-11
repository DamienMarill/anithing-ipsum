import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoremService} from '../services/lorem.service';
import type {LoremRequest} from '../models/lorem.models';

interface LoremForm {
  theme: FormControl<string>;
  paragraphs: FormControl<number>;
  paragraphLength: FormControl<'court' | 'moyen' | 'long' | 'variable'>;
}

@Component({
  selector: 'app-lorem-generator',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
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
          <form [formGroup]="form" (ngSubmit)="onSubmit()"
                class="bg-base rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-color-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 class="text-xl font-semibold text-color">Paramètres de génération</h3>
            </div>

            <div class="space-y-6">
              <!-- Theme Input -->
              <div>
                <label for="theme" class="block text-sm font-medium text-color mb-2">
                  Thème du lorem ipsum
                </label>
                <input
                  id="theme"
                  type="text"
                  formControlName="theme"
                  placeholder="Ex: pirates, cuisine française, space, medieval..."
                  class="w-full input"
                  [class.border-red-500]="form.get('theme')?.invalid && form.get('theme')?.touched"
                />
                @if (form.get('theme')?.invalid && form.get('theme')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Le thème est requis</p>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-6">
                <!-- Nombre de paragraphes avec input numérique et boutons -->
                <div>
                  <label for="paragraphs" class="block text-sm font-medium text-color mb-2">
                    Nombre de paragraphes
                  </label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="decrementParagraphs()"
                      class="flex items-center justify-center min-w-10 min-h-10 w-10 h-10 secondary"
                      [disabled]="isDecrementDisabled"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>

                    <input
                      id="paragraphs"
                      type="number"
                      min="1"
                      formControlName="paragraphs"
                      class="flex-1 w-1 text-center input"
                    />

                    <button
                      type="button"
                      (click)="incrementParagraphs()"
                      class="flex items-center justify-center  min-w-10 min-h-10 w-10 h-10 secondary"
                      [disabled]="isIncrementDisabled"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Taille de paragraphe en radio buttons -->
                <div>
                  <label class="block text-sm font-medium text-color mb-3">
                    Taille de paragraphe
                  </label>
                  <div class="flex gap-6 flex-wrap">
                    @for (option of paragraphLengthOptions; track option.value) {
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          [value]="option.value"
                          formControlName="paragraphLength"
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

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="form.invalid || isLoading()"
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
            </div>
          </form>
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
                  <h3 class="text-lg font-semibold">
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
export class LoremGeneratorComponent {
  private readonly loremService = inject(LoremService);

  // Signals pour l'état du composant
  readonly isLoading = signal(false);
  readonly result = signal<string>('');
  readonly error = signal<string>('');
  readonly currentTheme = signal<string>('');
  readonly copied = signal(false);

  // Options pour la taille de paragraphe
  readonly paragraphLengthOptions = [
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

  // Formulaire réactif avec validation
  readonly form = new FormGroup<LoremForm>({
    theme: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    }),
    paragraphs: new FormControl(3, {nonNullable: true}),
    paragraphLength: new FormControl('moyen' as const, {nonNullable: true})
  });

  // Méthodes pour incrémenter/décrémenter le nombre de paragraphes
  incrementParagraphs(): void {
    if (this.isLoading()) return; // Empêche l'action si en cours de chargement
    const current = this.form.get('paragraphs')?.value || 1;
    this.form.get('paragraphs')?.setValue(current + 1);
  }

  decrementParagraphs(): void {
    if (this.isLoading()) return; // Empêche l'action si en cours de chargement
    const current = this.form.get('paragraphs')?.value || 1;
    if (current > 1) {
      this.form.get('paragraphs')?.setValue(current - 1);
    }
  }

  // Méthodes pour gérer l'état disabled des contrôles
  private updateFormState(): void {
    if (this.isLoading()) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  // Getter pour vérifier si un bouton doit être désactivé
  get isDecrementDisabled(): boolean {
    return this.isLoading() || (this.form.get('paragraphs')?.value ?? 1) <= 1;
  }

  get isIncrementDisabled(): boolean {
    return this.isLoading();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value as Required<typeof this.form.value>;

    this.isLoading.set(true);
    this.updateFormState(); // Désactive le formulaire pendant le chargement
    this.error.set('');
    this.result.set('');
    this.currentTheme.set(formValue.theme);

    const request: LoremRequest = {
      theme: formValue.theme.trim(),
      paragraphs: formValue.paragraphs,
      paragraphLength: formValue.paragraphLength
    };

    // Utiliser le streaming par défaut pour une meilleure UX
    let accumulatedText = '';
    
    this.loremService.generateLoremStream(request).subscribe({
      next: (chunk) => {
        // Accumuler le texte au fur et à mesure
        accumulatedText += chunk;
        this.result.set(accumulatedText);
      },
      complete: () => {
        this.isLoading.set(false);
        this.updateFormState(); // Réactive le formulaire
        this.error.set('');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.updateFormState(); // Réactive le formulaire même en cas d'erreur
        this.error.set('Erreur de connexion au serveur');
        this.result.set('');
        console.error('Erreur:', err);
      }
    });
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
