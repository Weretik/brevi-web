'use client';

import './global.css';
import { manrope, ibmPlexMono } from './fonts';

/**
 * Last resort when the root layout itself fails. It replaces the whole document, so it brings its own `html` and
 * `body` and shows both languages: the failure may happen before the language is known. The status is 500.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="uk-UA" className={`${manrope.variable} ${ibmPlexMono.variable}`}>
      <body className="mx-auto grid max-w-3xl px-4">
        <section role="alert" className="py-12">
          <p className="font-mono text-sm text-muted-foreground">500</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Сайт тимчасово недоступний</h1>
          <p className="mt-3 text-muted-foreground">
            Не вдалося завантажити сторінку. Спробуйте ще раз за хвилину.
          </p>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight">Сайт временно недоступен</h2>
          <p className="mt-3 text-muted-foreground">
            Не удалось загрузить страницу. Попробуйте еще раз через минуту.
          </p>
          <button
            type="button"
            className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={retry}
          >
            Спробувати ще раз / Попробовать еще раз
          </button>
        </section>
      </body>
    </html>
  );
}
