import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@shared/ui';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { buildMenu } from './header.menu';

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    NgOptimizedImage,
    ToggleButtonModule,
    FormsModule,
    RouterLink,
    MegaMenu,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  public readonly themeService = inject(ThemeService);

  readonly items = buildMenu();

  public ngOnInit(): void {
    this.themeService.init();
  }

  public readonly megaMenuPt = {
    root: {
      style: {
        '--p-megamenu-submenu-label-color': 'var(--p-primary-500)',
      },
    },
    rootList: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    button: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    submenuLabel: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    buttonIcon: {
      style: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  };
}
