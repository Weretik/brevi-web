# Testing rules

## Scope and tools

Для React Admin стандартний стек — Vitest, React Testing Library (RTL) і
Playwright. Не додавайте інший test runner, assertion library або mock framework
без окремого рішення.

- **Vitest**: швидкі unit та integration tests.
- **RTL**: component і feature tests через поведінку користувача, ролі та
  accessible names, а не через внутрішній state чи CSS-класи.
- **Playwright**: критичні наскрізні сценарії у справжньому браузері.
- **Mock transport**: для integration tests використовуйте чинний mock на межі
  `baseApi` / transport; не викликайте реальний backend.

## Test pyramid and selection

Починайте з найменшого рівня, який дає достатню впевненість. Не дублюйте один
і той самий сценарій на всіх рівнях без причини.

| Зміна або ризик                                                      | Обов'язкова перевірка                   |
| -------------------------------------------------------------------- | --------------------------------------- |
| Pure model, mapper, formatter, validation, permission policy         | Unit test                               |
| RTK Query endpoint, DTO mapping, error mapping, cache / invalidation | Integration test з mock transport       |
| UI interaction, form, loading / empty / error / forbidden state      | RTL component або feature test          |
| Route, provider, guard або library interaction                       | Integration / architecture verification |
| Критичний користувацький journey, session або доступ за роллю        | Playwright e2e або `n/a` з причиною     |

Для кожної user story у spec має бути **Test strategy**: точні test files або
команди, сценарії, що покриваються, і рішення щодо e2e. `n/a` дозволене лише з
короткою перевірюваною причиною, наприклад «pure layout change, critical journey
не змінюється».

## Test design

- Тестуйте видимий результат і public contract, а не private implementation.
- Один тест перевіряє один зрозумілий outcome; назва описує умову й результат.
- Для API перевіряйте domain model, нормалізацію помилок, cancellation та
  permission states, коли вони змінюються.
- Для UI перевіряйте accessible name, keyboard/focus та user-visible states,
  якщо feature ними керує.
- Дані тестів мають бути локальними, детермінованими й без secrets або реальних PII.
- Уникайте `wait`/timeout як синхронізації та нестабільних snapshot-тестів.

## E2E policy

E2E не замінює unit та integration tests. Додавайте або оновлюйте Playwright
сценарій, коли змінюється хоча б один критичний flow: вхід/відновлення сесії,
route access, permission-sensitive mutation, створення/редагування ключової
сутності, платіж, експорт або завантаження файлу. Для іншої feature зафіксуйте
`e2e: n/a` у її Test strategy.

## React Admin readiness gate

`apps/admin-react` поки є лише bootstrap-застосунком. До завершення **першої
функціональної React Admin feature** обов'язково виконайте окрему технічну
задачу `TST-ADMIN-001`:

1. Налаштувати Vitest target для `admin-react` і для кожної React Admin library,
   створеної цією feature.
2. Додати RTL test setup і щонайменше один component/feature test, що перевіряє
   користувацький результат першої feature.
3. Створити Playwright e2e project та його Nx target.
4. Коли з'являться route, authentication/authorization і перша захищена
   mutation, додати e2e сценарії: відмова в доступі до route та успішне виконання
   ключової Admin-операції.

Поки цих React flows не існує, допустимий лише Playwright smoke test запуску
застосунку. Після їх появи `e2e: n/a` для access або ключової mutation не
допускається. Feature не вважається delivery-ready, доки `TST-ADMIN-001` не
закрито або його невиконання не оформлене як погоджений blocker з owner і датою.

## Required evidence

- Запускайте релевантні команди лише для змінених apps і libraries.
- Для Admin запускайте цільові `npx nx lint <project>` і `npx nx test <project>`;
  після feature-зміни також `npx nx build admin`.
- Запускайте відповідний Playwright target, коли e2e входить у Test strategy.
- Якщо test target ще не створено, це blocker для вимоги «automated test»:
  зафіксуйте точну відсутню ціль і створіть окрему технічну задачу.
- Якщо перевірка не виконана або впала, зафіксуйте точну команду, failure point і
  чи є причина pre-existing. Не приховуйте не пов'язані з feature failures.
