import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

interface Blog {
  category: string;
  title: string;
  description: string;
  date: string;
  cover: string;
}

@Component({
  selector: 'lib-articles-page',
  imports: [PageHeader, ProductCategories],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.scss',
})
export class ArticlesPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly articlesConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('articles.page.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('header.menu.about'),
        this.transloco.translate('articles.page.title'),
      ],
      showSearch: false,
    };
  });

  readonly blogs: Blog[] = [
    {
      category: 'Good News',
      title: 'Our Four-Legged Warriors',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '3 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-4.jpg',
    },
    {
      category: 'Science',
      title: 'Can We Learn From Horses?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-5.jpg',
    },
    {
      category: 'Good News',
      title: 'Sky-High Good Vibes',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '3 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-bird.jpg',
    },
    {
      category: 'Science',
      title: 'A Taller Perspective',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-giraffe.jpg',
    },
  ];
}
