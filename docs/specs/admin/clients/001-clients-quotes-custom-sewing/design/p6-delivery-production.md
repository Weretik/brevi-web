# P6 — надсилання та виробничий ZIP

Scope FE-009 / SC-D03, SC-S06: два блоки на існуючому екрані збереженого КП. Backend pinned SHA `3ad90271721bc58b61fa1efa11ae6c2cd87e9866`; реальний OAuth/test-send acceptance залишається EN-004 і не підміняється frontend mock.

Надсилання: користувач бачить номер/версію КП, готовий PDF, активну версію email-шаблону, вводить адресу й ім'я менеджера та явно підтверджує дію. Нові запити заблоковані для незбережених змін, архіву, неготового PDF/шаблону та чужого КП. Історія має сторінки й truthful queued/sending/reconciling/unknown/succeeded/failed; тільки succeeded означає підтвердження провайдера. Перевірка історії — read-only, жодного автоматичного повтору send.

Виробництво: explicit selection лише включених/видимих збережених custom variants; явний export із поточної виданої версії, показ pinned version/hash/size і приватне ZIP download. Немає Workshop transport/order і позначення sent. Зміна КП скидає локальні артефакти й ігнорує застарілі відповіді. Втрата доступу очищає приватний стан/cache.

Обидві write-дії утримують captured intent/requestId для мережевого повтору; double-click і зміна inputs під час невідомого результату заблоковані. API DTO/generated types лишаються в data-access; model містить presentation types, feature — orchestration/hooks, ui — MUI форми/списки. Скачування перевіряє MIME/ліміт/signature і не бере filename/path від сервера. OAuth/password поля в браузер не додаються.

Planned: `model/src/models/documents/*-view.ts`; `data-access/src/{api,mappers}/documents/`; `feature/src/{hooks,components}/documents/{delivery,production}/`; `ui/src/components/documents/{delivery,production}/`. Фокусовані mapper/HTTP/interaction тести та pinned contract checks; браузер/E2E не запускається без окремого дозволу.
