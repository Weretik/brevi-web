import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@core/services/theme.service';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RouterLink } from '@angular/router';
import { tokens } from '@shared/theme/design-tokens';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    IconField,
    InputIcon,
    NgOptimizedImage,
    InputText,
    ToggleButtonModule,
    FormsModule,
    Menubar,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly themeService = inject(ThemeService);

  public ngOnInit(): void {
    this.themeService.init();
  }

  public onThemeToggle(value: boolean): void {
    this.themeService.setTheme(value);
  }

  menuItems: MenuItem[] = [
    {
      label: 'Каталог',
      items: [
        { label: 'Зимовий одяг', routerLink: ['/catalog', 'winter'] },
        { label: 'Літній одяг', routerLink: ['/catalog', 'handles'] },
        { separator: true },
        { label: 'Захист очей', routerLink: ['/catalog', 'winter'] },
      ],
    },
    { label: 'Замовити оптом', routerLink: ['/contacts'] },
    { label: 'Регіони', routerLink: ['/contacts'] },
    { label: 'Про нас', routerLink: ['/contacts'] },
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
