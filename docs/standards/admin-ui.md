# Admin UI rules

## Language and components

- Видимі рядки, accessible names, empty/error messages і feature specs пишіть українською.
- Використовуйте наявні MUI patterns і theme; не створюйте локальні design tokens без потреби.
- Для table, dialog, select, pagination та інших складних business controls використовуйте наявні MUI components.
- Не змінюйте глобальні стилі, theme або routing заради локальної feature.

## States and accessibility

- Кожен екран із server data визначає застосовні `loading`, `success`, `empty`, `error` та `forbidden` states.
- Error state показує зрозуміле повідомлення без transport details і доступну retry-дію, якщо вона можлива.
- Інтерактивні елементи мають semantic HTML, keyboard navigation, visible focus і доступне ім'я.
- Icon-only control має `aria-label` або наявний еквівалент.
- Перевіряйте layout на погоджених вузьких і широких breakpoints.
