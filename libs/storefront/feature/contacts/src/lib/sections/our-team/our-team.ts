import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lib-our-team',
  imports: [TranslocoPipe],
  templateUrl: './our-team.html',
  styleUrl: './our-team.scss',
})
export class OurTeam {}
