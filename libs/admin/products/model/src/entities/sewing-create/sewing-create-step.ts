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
    title: 'Артикули',
    hint: '',
    instruction: 'Кожен артикул — свій колір або тканина.',
  },
  3: {
    title: 'Матеріали',
    hint: '',
    instruction: 'Спільні матеріали для всіх артикулів; окремо — тільки якщо норма інша.',
  },
  4: {
    title: 'Операції',
    hint: 'трудовитрати',
    instruction:
      'Вкажіть час, кількість і яку частину виробу шиє операція. «Перевірено» — тільки після реальної перевірки.',
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

export type SewingCreateCheckKey = 'article' | 'materials' | 'composition' | 'labour' | 'reviewed';

export interface SewingCreateCheck {
  key: SewingCreateCheckKey;
  label: string;
  state: SewingCreateCheckState;
}

export const sewingCreateCheckLabels: Record<SewingCreateCheckKey, string> = {
  article: 'Немає артикула',
  materials: 'Немає тканини / фурнітури',
  composition: 'Неповна комплектація',
  labour: 'Немає трудовитрат',
  reviewed: 'Операції не підтверджено',
};
