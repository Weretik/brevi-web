import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './storefront-layout.html',
  styleUrl: './storefront-layout.scss',
})
export class StorefrontLayout {}
