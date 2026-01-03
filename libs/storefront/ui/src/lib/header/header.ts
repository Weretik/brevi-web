import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService, tokens } from '@shared/ui';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    NgOptimizedImage,
    ToggleButtonModule,
    FormsModule,
    Menubar,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  public readonly themeService = inject(ThemeService);

  public ngOnInit(): void {
    this.themeService.init();
  }
  menuItems: MenuItem[] = [
    {
      label: 'Каталог',
      items: [
        { label: 'Зимовий одяг', routerLink: ['/catalog'] },
        { label: 'Літній одяг', routerLink: ['/catalog'] },
        { separator: true },
        { label: 'Захист очей', routerLink: ['/catalog', 'winter'] },
      ],
    },
    { label: 'Замовити оптом', routerLink: ['/order-in-bulk'] },
    { label: 'Регіони', routerLink: ['/regions'] },
    {
      label: 'Про нас',
      items: [
        { label: 'Про компанію', routerLink: ['/about-company'] },
        { label: 'Доставка та оплата', routerLink: ['/delivery-and-payment'] },
        { label: 'Повернення / обмін', routerLink: ['/returns-exchanges'] },
        { label: 'Наші роботи', routerLink: ['/our-work'] },
        { label: 'Сертифікати', routerLink: ['/certificates'] },
        { label: 'Договір', routerLink: ['/agreement'] },
        { label: 'Статті', routerLink: ['/articles'] },
      ],
    },
    { label: 'Контакти', routerLink: ['/contacts'] },
  ];

  menubarPt = computed(() => ({
    root: {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',

        '--p-menubar-background': tokens.colors.neutral,
        '--p-menubar-item-color': tokens.colors.textOnDark,
        '--p-menubar-item-icon-color': tokens.colors.textOnDark,

        '--p-menubar-mobile-button-size': '2.5rem',
        '--p-menubar-mobile-button-color': '#ffffff',
        '--p-menubar-mobile-button-hover-color': this.themeService.isDark()
          ? '#ffffff'
          : tokens.colors.primary,

        '--p-menubar-submenu-icon-color': '#ffffff',
        '--p-menubar-submenu-background': '#333333',
      },
    },
    buttonIcon: {
      style: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
    itemLabel: {
      style: {
        fontWeight: '600',

        textTransform: 'uppercase',
        fontSize: '0.95rem',
      },
    },
    start: { style: { justifySelf: 'start' } },
    rootList: { style: { justifySelf: 'center' } },
    end: { style: { justifySelf: 'end' } },
  }));
}
