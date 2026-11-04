/** A step of the «Нова модель» wizard, as in the client's sheet instruction. */
export type SewingCreateStep = 1 | 2 | 3 | 4 | 5;

export const sewingCreateSteps: readonly SewingCreateStep[] = [1, 2, 3, 4, 5];

export interface SewingCreateStepInfo {
  title: string;
  hint: string;
  /** The sheet rule of the step for the «Інструкція» card. */
  instruction: string;
}

export const sewingCreateStepInfo: Record<SewingCreateStep, SewingCreateStepInfo> = {
  1: {
    title: 'Модель',
    hint: 'код, назва, розділ',
    instruction: 'Код MOD-XXX має бути унікальним.',
  },
  2: {
    title: 'Тканини',
    hint: '',
    instruction: 'Кожна тканина — окремий артикул на сайті зі своїм розходом.',
  },
  3: {
    title: 'Комплектація',
    hint: '',
    instruction: 'Фурнітура та інші витрати спільні для всіх тканин моделі.',
  },
  4: {
    title: 'Операції',
    hint: 'трудовитрати',
    instruction: 'Вкажіть час, кількість і яку частину виробу шиє операція.',
  },
  5: {
    title: 'Перевірка',
    hint: 'ціни і запуск',
    instruction: 'Усі ціни мають бути вищі за повну собівартість.',
  },
};

/** Minutes of one sewing shift, as the sheet «Трудовитрати виробів» counts pieces per shift. */
export const sewingShiftMinutes = 480;

/** One line of «Що заважає розрахунку». `unknown` until the data to check it exists. */
export type SewingCreateCheckState = 'ok' | 'blocking' | 'unknown';

export type SewingCreateCheckKey = 'article' | 'materials' | 'composition' | 'labour';

export interface SewingCreateCheck {
  key: SewingCreateCheckKey;
  label: string;
  state: SewingCreateCheckState;
}

export const sewingCreateCheckLabels: Record<SewingCreateCheckKey, string> = {
  article: 'Немає тканини',
  materials: 'Тканину не вказано',
  composition: 'Неповна комплектація',
  labour: 'Немає трудовитрат',
};
