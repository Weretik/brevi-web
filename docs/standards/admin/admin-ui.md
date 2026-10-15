# Правила UI Admin

## Мова та компоненти

- Видимі рядки, accessible names, empty/error messages і feature specs пишіть українською.
- Використовуйте наявні MUI patterns і theme; не створюйте локальні design tokens без потреби.
- Для table, dialog, select, pagination та інших складних business controls використовуйте наявні MUI components.
- Не змінюйте глобальні стилі, theme або routing заради локальної feature.

## Стани та доступність

- Кожен екран із server data визначає застосовні `loading`, `success`, `empty`, `error` та `forbidden` states.
- Error state показує зрозуміле повідомлення без transport details і доступну retry-дію, якщо вона можлива.
- Інтерактивні елементи мають semantic HTML, keyboard navigation, visible focus і доступне ім'я.
- Icon-only control має `aria-label` або наявний еквівалент.
- Перевіряйте layout на погоджених вузьких і широких breakpoints.

## Перевірка UI

- `SC-*` описує очікуваний результат для користувача і не замінює test file.
- Нова interaction або зміна loading, empty, error, forbidden чи success state
  має focused component test після налаштування доступного test target.
- Keyboard, focus і accessible-name behavior автоматизуйте на component level,
  якщо DOM environment відтворює ризик; реальний browser journey перевіряйте E2E
  лише для критичного flow.
- Візуальну перевірку breakpoints і theme фіксуйте як manual evidence, доки в
  repository немає погодженого visual-regression tooling.
