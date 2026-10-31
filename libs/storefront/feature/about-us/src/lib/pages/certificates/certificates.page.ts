import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-certificates',
  imports: [],
  templateUrl: './certificates.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './certificates.page.scss',
})
export class CertificatesPage {}
