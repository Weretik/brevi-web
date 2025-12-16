import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@storefront/shared/footer/footer';
import { Header } from '@storefront/shared/header/header';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './storefront-layout.html',
  styleUrl: './storefront-layout.scss',
})
export class StorefrontLayout {}
