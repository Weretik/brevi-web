import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'lib-product-page',
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, PageHeader],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage {
  color: string = 'black';
  size: string = '20L';
  liked: boolean = false;
  images: string[] = ['tabs-1.jpg', 'tabs-2.jpg', 'tabs-3.jpg', 'tabs-4.jpg'];
  selectedImageIndex: number = 0;
  quantity: number = 1;
  activeTab: number = 0;

  productPageConfig: PageHeaderConfig = {
    title: 'Товар 1',
    breadcrumbs: ['Головна', 'Каталог', 'Зимовий одяг', 'Товар 1'],
    showSearch: false,
  };

  reviews = [
    {
      name: 'Eleanor Pena',
      date: '2 days ago',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-kathryn.png',
      comment:
        'Perfect backpack for daily commuting and weekend trips! The build quality is exceptional and it fits my laptop perfectly. Multiple compartments keep everything organized. Comfortable straps even when fully loaded.',
    },
    {
      name: 'Wade Warren',
      date: '4 days ago',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-paul.png',
      comment:
        'Amazing backpack that exceeded my expectations! Waterproof material saved my gear during a sudden rainstorm. Love the sleek design and all the pockets. Definitely worth the investment for outdoor adventures.',
    },
    {
      name: 'Robert Fox',
      date: '1 week ago',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-ronald.png',
      comment:
        'Great quality backpack with excellent durability. The design is stylish and functional for both work and travel. Only wish it had one more external pocket, but overall very satisfied with this purchase.',
    },
  ];
}
