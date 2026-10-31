import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-our-work',
  imports: [],
  templateUrl: './our-work.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './our-work.page.scss',
})
export class OurWorkPage {}
