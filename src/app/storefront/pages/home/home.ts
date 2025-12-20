import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { WithBreadcrumbMetaAndActions } from '@storefront/shared/with-breadcrumb-meta-and-actions/with-breadcrumb-meta-and-actions';
import { WithAvatarMetaAndActions } from '@storefront/shared/with-avatar-meta-and-actions/with-avatar-meta-and-actions';

@Component({
  selector: 'app-home',
  imports: [Button, WithBreadcrumbMetaAndActions, WithAvatarMetaAndActions],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
