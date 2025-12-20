import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-with-breadcrumb-meta-and-actions',
  imports: [CommonModule, ButtonModule],
  templateUrl: './with-breadcrumb-meta-and-actions.html',
})
export class WithBreadcrumbMetaAndActions {}
