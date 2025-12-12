import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Reference } from '../../../admin/features/reference';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './storefront-layout.html',
  styleUrl: './storefront-layout.scss',
})
export class StorefrontLayout {
 public ref = new Reference();
}
