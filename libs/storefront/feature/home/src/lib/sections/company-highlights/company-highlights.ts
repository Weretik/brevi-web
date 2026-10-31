import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-company-highlights',
  imports: [],
  templateUrl: './company-highlights.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './company-highlights.scss',
})
export class CompanyHighlights {}
