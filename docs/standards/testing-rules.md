# Testing rules

## Choose verification by risk

- Pure model, mapper і validation rules — unit tests.
- RTK Query endpoint, error mapping і library interaction — integration tests із mock transport.
- User journey, navigation, loading/empty/error state — component або feature tests.
- Route, provider, dependency або Nx-boundary changes — додайте відповідну architecture/integration verification.

## Required evidence

- Запускайте релевантні команди лише для змінених apps і libraries.
- Для Mobile використовуйте `npx nx test mobile`, `npx expo-doctor` і ручну Expo Go/device перевірку; web export потрібний лише коли web входить у scope.
- Для Admin запускайте релевантні Nx lint, test і build targets.
- Якщо перевірка не виконана або впала, зафіксуйте точну команду, failure point і чи є причина pre-existing.
- Не приховуйте не пов'язані з feature failures.
