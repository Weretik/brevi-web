import { Component } from '@angular/core';
import { PageHeader } from '@shared/ui/page-header/page-header';

@Component({
  selector: 'app-home',
  imports: [PageHeader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
