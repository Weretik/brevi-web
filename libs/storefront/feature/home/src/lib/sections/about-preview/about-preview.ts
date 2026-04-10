import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'lib-about-preview',
  imports: [ButtonDirective, TranslocoPipe],
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.scss',
})
export class AboutPreview {}
