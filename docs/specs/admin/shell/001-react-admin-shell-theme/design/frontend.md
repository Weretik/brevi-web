# Оболонка та тема React Admin — проєктування frontend

## Перевірений контекст

- На початку роботи `apps/admin-react/src/app/app.tsx` повертав `null`;
  `main.tsx` монтував React, а `styles.css` містив лише базові правила.
  Тепер app компонує тему, shell, `/` і fallback; бізнес-маршрутів немає.
- `apps/admin-react/project.json` та Nx inferred targets мають `lint`,
  `typecheck`, `typecheck-tests`, `test`, `build`, `serve`. Наявні
  `vitest.config.mts`, `src/test-setup.ts`, компонентний harness test і
  `apps/admin-react-e2e` з Playwright smoke.
- Поточний Angular Admin: `apps/admin/src/styles.css`,
  `libs/shared/theme/src/lib/design-tokens.json`,
  `libs/admin/shell/src/lib/layout/sidebar/sidebar.html`,
  `apps/admin/public/assets/logo/brevi-logo-{light,dark}.png`. Це джерела
  Brevi кольорів, логотипа й потрібних елементів shell; Angular/PrimeNG код не
  переноситься буквально.
- `D:/RiderProjects/kedr-web/apps/admin/src/app/{providers,router,theme}/` та
  `D:/RiderProjects/kedr-web/libs/admin/core/shell/src/` — локальний референс
  композиції MUI theme, роутера, layout, верхньої панелі, drawer і області
  сторінки. Палітра, текст, логотип, назви розділів і профіль Kedr не є
  вимогами Brevi. Референс поза цим репозиторієм; для реалізації достатньо
  рішень, записаних тут.
- Цільові межі описані в `docs/architecture/admin/application.md`,
  `domains.md` і `dependencies.md`; `libs/admin/core/shell` створено в цій
  feature.

## Відповідальності та шляхи

| Область         | Рішення та заплановані шляхи                                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App composition | `apps/admin-react/src/app/app.tsx`, `router/app-router.tsx`, `providers/app-providers.tsx`: один router і підключення shell; `pages/` містить початкову сторінку та fallback.                            |
| Тема            | `apps/admin-react/src/app/theme/`: Brevi palette окремо від спільних MUI theme options; `providers/color-mode-provider.tsx` відповідає за вибір схеми й ThemeProvider; `src/styles.css` — базовий reset. |
| Спільний shell  | `libs/admin/core/shell/src/layout/` компонує route content і стан мобільного меню; `navigation/` містить пункти та drawer, `components/` — top bar і меню теми. Публічний export — `src/index.ts`.       |
| Навігація       | App володіє таблицею реалізованих маршрутів; shell отримує лише доступні пункти та active route. Початково доступний тільки кореневий маршрут із нейтральним placeholder вмістом для перевірки каркаса.  |
| Активи          | Локальні Brevi logo assets копіюються або адаптуються з `apps/admin/public/assets/logo/` до `apps/admin-react/public/assets/logo/` зі збереженням походження; зовнішні avatar URL не використовуються.   |
| Перевірка       | Компонентні тести shell і теми; інтеграційний тест app router/provider; один browser journey для прямої адреси й мобільного меню.                                                                        |

`@admin/core/shell` не імпортує app modules, Angular libraries, API або
конкретні domain features. `apps/admin-react` композиційно передає маршрути
та menu metadata. Майбутня сторінка з'явиться всередині тієї самої області
через route outlet, без власної копії header/sidebar.

## Корпоративна тема Brevi

- Первинний бренд — `#fd9600`, нейтральний — `#333333`; світле тло
  `#e6e6e6`, темне `#09090b`. Це чинні значення з Angular Admin і
  `design-tokens.json`, а не палітра Kedr.
- Підтримати світлий і темний варіанти та вибір `system`. Для інших
  семантичних кольорів взяти чинні Brevi tokens, перевірити контраст тексту,
  іконок та фокуса на обох тлах. Не використовувати primary там, де він не
  забезпечує читабельність.
- Початковий режим — системний за відсутності збереженого вибору. Вибір
  зберігати локально; при переході з Angular Admin врахувати його `theme`
  (`light`/`dark`) без залежності від Angular `ThemeService`. Недоступне
  сховище не ламає рендеринг; скидання до системного режиму лишається
  можливим.
- MUI theme належить React Admin. Значення Brevi можна взяти з наявного
  `design-tokens.json` під час реалізації, але `@admin/*` не імпортує
  `@shared/theme`: це порушує чинне правило Nx boundaries. Якщо потрібне
  спільне machine-owned джерело tokens, оформити окреме рішення, а не
  послаблювати залежності в цій feature.
- Для видимих назв і доступних імен використовувати українську мову.

## Shell і маршрути

Широкий екран: бічна навігація, top bar і обмежена по ширині область сторінки.
Вузький екран: top bar із кнопкою меню, тимчасова навігаційна панель і
повноширинна область сторінки. Сторінка не повинна розширювати viewport через
shell; довгі заголовки й вузькі екрани перевіряються окремо. Логотип має
читабельний варіант для кожного тла.

Єдиний доступний production route у цій feature — `/`, із коротким нейтральним
повідомленням про готову оболонку без обіцянки dashboard-функціональності.
Невідомі URL показують стан «Сторінку не знайдено» всередині shell з
посиланням на `/`. Пункти Angular sidebar без React routes не відображаються
як дієві. Додавання кожної бізнес-сторінки надалі оновлює route та навігацію
в її власній feature-специфікації.

Фокус після закриття мобільного меню повертається на кнопку відкриття або
видиму ціль переходу. `aria-current` позначає активний маршрут; кнопку меню
та перемикач теми можна керувати клавіатурою. Header не показує меню профілю,
сповіщення або пошук до появи даних і поведінки для них.

## Ризики та перевірка

- `libs/admin/core/shell` отримав власні Nx lint/typecheck/test targets у
  `EN-001`; MUI dependency сама по собі не була доказом реалізації shell.
- Локальні логотипи перевірити в браузері на обох тлах і 320/768/1280 px.
- Тема й мобільне меню перевіряються component tests; direct URL і fallback —
  integration/browser test. Окрему visual regression систему ця feature не
  додає; візуальну відповідність Brevi фіксують manual evidence.
- API відсутній, тому `contracts/api-contract.md` і перевірки OpenAPI не
  застосовуються. Auth/profile та notifications не отримують фіктивних даних.
