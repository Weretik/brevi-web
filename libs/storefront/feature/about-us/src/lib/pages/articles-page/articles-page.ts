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

  readonly blogs = computed<Blog[]>(() => {
    this.activeLang();
    return [
      {
        category: this.transloco.translate('articles.cards.item1.category'),
        title: this.transloco.translate('articles.cards.item1.title'),
        description: this.transloco.translate('articles.cards.item1.description'),
        date: this.transloco.translate('articles.cards.item1.date'),
        cover:
          'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-4.jpg',
      },
      {
        category: this.transloco.translate('articles.cards.item2.category'),
        title: this.transloco.translate('articles.cards.item2.title'),
        description: this.transloco.translate('articles.cards.item2.description'),
        date: this.transloco.translate('articles.cards.item2.date'),
        cover:
          'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-5.jpg',
      },
      {
        category: this.transloco.translate('articles.cards.item3.category'),
        title: this.transloco.translate('articles.cards.item3.title'),
        description: this.transloco.translate('articles.cards.item3.description'),
        date: this.transloco.translate('articles.cards.item3.date'),
        cover:
          'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-bird.jpg',
      },
      {
        category: this.transloco.translate('articles.cards.item4.category'),
        title: this.transloco.translate('articles.cards.item4.title'),
        description: this.transloco.translate('articles.cards.item4.description'),
        date: this.transloco.translate('articles.cards.item4.date'),
        cover:
          'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-giraffe.jpg',
      },
    ];
  });
}
