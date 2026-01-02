import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './contact-us.html',
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
