import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

@Component({
  selector: 'lib-contact-us',
  imports: [
    InputTextModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    TranslocoPipe,
  ],
  templateUrl: './contact-us.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-us.scss',
})
export class ContactUs {
  contact: ContactForm = {
    name: '',
    email: '',
    company: '',
    message: '',
  };
}
