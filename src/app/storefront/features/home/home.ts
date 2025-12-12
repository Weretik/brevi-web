import { Component } from '@angular/core';

import { Button } from 'primeng/button';
import { Reference } from '../../../admin/features/reference';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public ref = new Reference();
}
