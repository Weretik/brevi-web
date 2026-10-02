# EN-001 — Безпечний renderer опису

- **ID задачі:** EN-001
- **Уможливлює:** SC-003
- **Залежить від:** немає
- **Точні шляхи:** `package.json`, `package-lock.json`, `libs/admin/products/ui/src/product-editor/content/product-description-fields.tsx` (цільовий), `libs/admin/products/ui/src/product-detail/product-detail-content.tsx` (цільовий), `libs/admin/products/ui/src/product-detail/product-localized-detail.component.test.tsx` (цільовий)
- **Рівень тестування:** перевірка налаштування

## Робота

- [x] Перевірити наявні залежності й вибрати найменший підтримуваний Markdown renderer/sanitizer для дозволених абзаців, заголовків, списків, посилань і акцентів; raw HTML, зображення й таблиці не рендерити.
- [x] За потреби додати лише потрібні package й lockfile зміни; підтвердити поведінку на небезпечному HTML і `javascript:` URL.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Чому поведінковий Red не має сенсу: це prerequisite renderer/setup, а не нова видима поведінка; TS-003 виконає поведінковий Red.
- Вибір package, команда інсталяції/перевірки й результат: npm install react-markdown@10.1.0 — успішно; package.json/package-lock.json оновлено.
- Перевірені інструменти/команди й результат: `npx nx test admin-products-feature -- product-markdown.component.test.tsx` — 1/1; raw HTML, image, table та `javascript:` URL перевірені.
- Уможливлена задача: TS-003.

## Контрольна точка

Безпечний renderer доступний TS-003 без raw HTML, зображень і таблиць.
