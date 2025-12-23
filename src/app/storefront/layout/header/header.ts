import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@core/services/theme.service';

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
}
