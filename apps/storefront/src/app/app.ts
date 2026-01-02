import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@storefront/ui';
import { Toast } from 'primeng/toast';

@Component({
  imports: [RouterModule, Toast, Footer, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'storefront';
}
