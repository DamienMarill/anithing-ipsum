import { Component, signal } from '@angular/core';
import { LoremGeneratorComponent } from './components/lorem-generator.component';

@Component({
  selector: 'app-root',
  imports: [LoremGeneratorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('anything-ipsum');
}
