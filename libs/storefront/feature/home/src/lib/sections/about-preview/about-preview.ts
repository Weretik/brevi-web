import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'lib-about-preview',
  imports: [ButtonDirective],
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.scss',
})
export class AboutPreview {}
