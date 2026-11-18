import { QuoteIntroSeasonFields } from './quote-intro-season-fields';
import { QuoteColorField } from '../../form/quote-color-field';
import { QuoteSettingsField } from '../../form/quote-settings-field';
import { QuoteSettingsGroup, QuoteSettingsGrid, errorsAt } from '../../form/quote-settings-layout';
import { QuoteAdvantagesList } from '../company/quote-advantages-list';

import type { QuoteModelFieldRender } from './quote-intro-season-fields';
import type { QuoteImageFieldRender } from '../../form/quote-settings-layout';
import type {
  QuoteAdvantageDraft,
  QuoteIntroductionDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';

type TextKey = Exclude<keyof QuoteIntroductionDraft, 'advantages'>;

interface Props {
  introduction: QuoteIntroductionDraft;
  saved: QuoteIntroductionDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  modelField: QuoteModelFieldRender;
  onChange: (patch: Partial<QuoteIntroductionDraft>) => void;
  onAdvantageChange: (index: number, patch: Partial<QuoteAdvantageDraft>) => void;
  onAdvantageMove: (from: number, to: number) => void;
}

const texts: {
  key: TextKey;
  label: string;
  multiline?: boolean;
  wide?: boolean;
  hint?: string;
}[] = [
  { key: 'subtitle', label: 'Підзаголовок', multiline: true, wide: true },
  { key: 'modelsTitle', label: 'Заголовок блоку моделей' },
  { key: 'productButtonText', label: 'Текст кнопки товару' },
  { key: 'assortmentLinkText', label: 'Текст посилання на асортимент' },
  { key: 'assortmentUrl', label: 'Посилання на асортимент' },
  {
    key: 'pricesNote',
    label: 'Примітка під моделями',
    wide: true,
    hint: 'Порожньо — рядка в PDF не буде.',
  },
  { key: 'nextStepText', label: 'Наступний крок', multiline: true, wide: true },
];

/** «КП для знайомства»: look, the two season pages, «Переваги» and the remaining texts. */
export function QuoteIntroductionSection({
  introduction,
  saved,
  errors,
  imageField,
  modelField,
  onChange,
  onAdvantageChange,
  onAdvantageMove,
}: Props) {
  const at = errorsAt(errors, 'introduction');
  const text = (
    key: TextKey,
    label: string,
    { hint, ...options }: { multiline?: boolean; wide?: boolean; hint?: string },
  ) => (
    <QuoteSettingsField
      key={key}
      path={`introduction.${key}`}
      label={label}
      {...options}
      helperText={hint}
      value={introduction[key]}
      saved={saved[key]}
      error={at(key)}
      onChange={(value) => onChange({ [key]: value })}
    />
  );
  return (
    <>
      <QuoteSettingsGroup title="Вигляд">
        <QuoteSettingsGrid>
          <QuoteColorField
            label="Колір акценту"
            path="introduction.accentColor"
            value={introduction.accentColor}
            error={at('accentColor')}
            onChange={(accentColor) => onChange({ accentColor })}
          />
          {text('logoText', 'Текст біля логотипа', {})}
        </QuoteSettingsGrid>
      </QuoteSettingsGroup>

      <QuoteIntroSeasonFields
        introduction={introduction}
        saved={saved}
        errors={errors}
        imageField={imageField}
        modelField={modelField}
        onChange={onChange}
      />

      <QuoteSettingsGroup title="Переваги">
        <QuoteAdvantagesList
          advantages={introduction.advantages}
          saved={saved.advantages}
          errors={errors}
          onChange={onAdvantageChange}
          onMove={onAdvantageMove}
        />
      </QuoteSettingsGroup>

      <QuoteSettingsGroup title="Тексти і посилання">
        <QuoteSettingsGrid>
          {texts.map(({ key, label, ...options }) => text(key, label, options))}
        </QuoteSettingsGrid>
      </QuoteSettingsGroup>
    </>
  );
}
