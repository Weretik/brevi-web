import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { NgOptimizedImage } from '@angular/common';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconField, InputIcon, InputText, NgOptimizedImage, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  items = [
    { label: 'Головна', routerLink: '/' },
    { label: 'Каталог', routerLink: '/catalog' },
    { label: 'Контакти', routerLink: '/contacts' },
  ];
}
