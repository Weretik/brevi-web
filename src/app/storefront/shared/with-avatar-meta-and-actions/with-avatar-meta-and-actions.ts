import { Component } from '@angular/core';
import { ButtonDirective, ButtonIcon } from 'primeng/button';
@Component({
  selector: 'app-with-avatar-meta-and-actions',
  imports: [ButtonDirective, ButtonIcon],
  templateUrl: './with-avatar-meta-and-actions.html',
  styleUrl: './with-avatar-meta-and-actions.scss',
})
export class WithAvatarMetaAndActions {}
