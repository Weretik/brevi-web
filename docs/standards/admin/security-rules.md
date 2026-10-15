# Правила безпеки

## Межі та відповідальність

Ці правила застосовні до React Admin. Frontend покращує безпечну поведінку UI,
але не є security boundary: backend зобов'язаний перевіряти authentication,
authorization, ownership і валідацію кожного request.

Кожна Admin feature фіксує у spec ролі, route access, доступ до кожної mutation,
чутливі дані та рішення `basic`, `elevated` або `n/a` для security review.

## Доступ і сесія

- Route guard і UI можуть приховати недоступну дію, але endpoint все одно має
  бути захищений backend permission check.
- Для захищених flows визначайте поведінку `401` (сесія відсутня/завершилась) і
  `403` (роль не має права); не показуйте дані або успіх після відмови.
- Використовуйте лише чинний `AuthSessionAdapter` і спільний API transport.
  Не створюйте власні token storage, Axios client або refresh flow у feature.
- Не передавайте access token у URL, analytics, логи або помилки.

## Дані, введення та виведення

- DTO валідуються та мапляться на межі `data-access`; UI не показує raw API
  error, stack trace або внутрішні ідентифікатори.
- Не використовуйте `dangerouslySetInnerHTML`. HTML з недовіреного джерела
  потребує окремого погодженого sanitizer і security review.
- Не кладіть secrets, токени, персональні дані, request/response body у source,
  документацію, telemetry або логи.
- Для файлів, CSV/export, зовнішніх URL, масових операцій і PII зазначайте
  окремі правила доступу, валідації та audit/confirmation requirements.

## Транспорт і спостережуваність

- Використовуйте чинні bearer, refresh, CSRF та credentials механізми transport
  без їх дублювання у domain feature.
- Логи можуть містити тільки method, sanitized URL, status, duration і
  correlation/trace ID за чинним API-контрактом; headers і body заборонені.
- Не додавайте security headers, cookie attributes або CSP лише у frontend spec:
  це deployment/backend responsibility і потребує узгодженого contract.

## Пропорційний огляд і перевірка

| Рівень     | Коли                                                           | Мінімальна перевірка                                                       |
| ---------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `n/a`      | Локальна зміна без даних, route або API                        | Причина у spec                                                             |
| `basic`    | Звичайна authenticated Admin feature                           | Ролі, 401/403, error exposure, PII/logging check                           |
| `elevated` | Auth, permissions, PII, файли, export, bulk/destructive action | Короткий threat model, негативні automated tests і review backend contract |

Threat model для `elevated` містить: asset, actor, entry point, загрозу,
серверне пом'якшення ризику, поведінку frontend і спосіб перевірки. Тести
безпеки перевіряють відмову в UI та коректну обробку 401/403; вони не замінюють
серверні тести авторизації.
