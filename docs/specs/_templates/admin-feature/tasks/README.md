# Фази реалізації: <назва Admin feature>

Задачі виконуються послідовно за фазами. Кожна user story має бути independently
testable; наступна фаза починається лише після checkpoint попередньої.

| Фаза                                       | Результат                                |
| ------------------------------------------ | ---------------------------------------- |
| [00 — Specify і plan](00-specify-plan.md)  | погоджені scope, contract і source paths |
| [01 — Foundation](01-foundation.md)        | спільні передумови без user-facing scope |
| [02 — User story P1](02-user-story-p1.md)  | перша independently testable поставка    |
| [03 — User story P2+](03-user-story-p2.md) | наступні незалежні user stories          |
| [99 — Polish](99-polish.md)                | cross-cutting verification і delivery    |

Формат задачі: `[ID] [P?] [US#] опис із точним шляхом`. `[P]` означає, що
задача не конфліктує з іншою за файлами й залежностями.

Кожна user story містить задачі, які реалізують її Test strategy і погоджені
security scenarios. Якщо рівень перевірки не застосовний, задача фіксує `n/a`
та причину; мовчазно пропускати test або security review не можна.
