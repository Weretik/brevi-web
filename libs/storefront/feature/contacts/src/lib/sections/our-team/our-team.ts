import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lib-our-team',
  imports: [TranslocoPipe],
  templateUrl: './our-team.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './our-team.scss',
})
export class OurTeam {}
