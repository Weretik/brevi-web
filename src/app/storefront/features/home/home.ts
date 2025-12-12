import { Component } from '@angular/core';
import {Reference} from '../../../admin/features/reference';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public ref= new Reference();
}
