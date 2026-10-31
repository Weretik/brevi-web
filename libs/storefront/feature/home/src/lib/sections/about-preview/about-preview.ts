import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'lib-about-preview',
  imports: [ButtonDirective, TranslocoPipe],
  templateUrl: './about-preview.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-preview.scss',
})
export class AboutPreview {}
