import { Component, signal } from '@angular/core';
import { LoremGeneratorNewComponent } from './components/lorem-generator-new.component';

@Component({
  selector: 'app-root',
  imports: [LoremGeneratorNewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('anything-ipsum');
}
