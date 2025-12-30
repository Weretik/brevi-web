import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, Footer } from '@storefront/ui';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './storefront-layout.html',
  styleUrl: './storefront-layout.scss',
})
export class StorefrontLayout {}
