import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/ui';

@Component({
  selector: 'lib-footer',
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly theme = inject(ThemeService);
}
