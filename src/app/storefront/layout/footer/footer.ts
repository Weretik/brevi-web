import { Component, inject } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-footer',
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly theme = inject(ThemeService);
}
