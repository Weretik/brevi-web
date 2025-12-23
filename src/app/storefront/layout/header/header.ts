import { Component, inject, OnInit } from '@angular/core';
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
export class Header implements OnInit {
  private readonly themeService = inject(ThemeService);
  public checked = false;

  private ngOnInit(): void {
    this.checked = this.themeService.getTheme();
    this.themeService.setTheme(this.checked);
  }

  public onThemeToggle(value: boolean): void {
    this.checked = value;
    this.themeService.setTheme(value);
  }

  public toggleTheme(): void {
    this.checked = !this.checked;
    this.onThemeToggle(this.checked);
  }
}
