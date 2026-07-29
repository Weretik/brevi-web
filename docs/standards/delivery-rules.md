# Delivery rules

## SDD flow

1. Створіть або оновіть feature `spec.md`: user stories, scope, requirements і acceptance criteria.
2. Додайте `research.md`, `data-model.md` і contracts лише якщо вони мають зміст.
3. Створіть `plan.md` з реальними source paths і межами відповідальності.
4. Розбийте реалізацію на numbered files у `tasks/`: foundation, independently testable user stories і final verification.
5. Реалізуйте лише погоджений scope та фіксуйте фактичний результат у фазах і quickstart.

## Documentation and completion

- Один документ має одну відповідальність; не створюйте порожніх або дубльованих файлів.
- Stable rules належать у `docs/standards`; feature spec посилається на них, а не копіює їх.
- ADR потрібен лише для тривалого архітектурного рішення; звичайне feature-рішення належить у `research.md` або `plan.md`.
- Definition of done: acceptance criteria виконані, релевантні перевірки пройшли або причина записана, документація й contracts збігаються з кодом, а залишкові ризики зазначені.
