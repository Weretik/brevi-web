import { Box, Typography } from '@mui/material';

import {
  QuoteSettingsCard,
  QuoteSettingsField,
  QuoteSettingsGrid,
  errorsAt,
} from './quote-settings-fields';

import type { QuoteImageFieldRender } from './quote-settings-fields';
import type {
  QuoteAdvantageDraft,
  QuoteIntroductionDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';

type TextKey = Exclude<keyof QuoteIntroductionDraft, 'advantages'>;

interface Props {
  introduction: QuoteIntroductionDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  onChange: (patch: Partial<QuoteIntroductionDraft>) => void;
  onAdvantageChange: (index: number, patch: Partial<QuoteAdvantageDraft>) => void;
}

const texts: { key: TextKey; label: string; wide?: boolean; multiline?: boolean }[] = [
  { key: 'logoText', label: 'Текст біля логотипа' },
  { key: 'accentColor', label: 'Колір акценту (#RRGGBB)' },
  { key: 'summerTitle', label: 'Заголовок — літо' },
  { key: 'winterTitle', label: 'Заголовок — зима' },
  { key: 'subtitle', label: 'Підзаголовок', wide: true, multiline: true },
  { key: 'modelsTitle', label: 'Заголовок блоку моделей' },
  { key: 'productButtonText', label: 'Текст кнопки товару' },
  { key: 'assortmentLinkText', label: 'Текст посилання на асортимент' },
  { key: 'assortmentUrl', label: 'Посилання на асортимент' },
  { key: 'summerMainCode', label: 'Головна модель — літо (код, типово MOD-166)' },
  { key: 'winterMainCode', label: 'Головна модель — зима (код, типово MOD-169)' },
  { key: 'nextStepText', label: 'Наступний крок', wide: true, multiline: true },
];

/** «КП для знайомства — рекламний каталог»: texts, banners and five «Переваги». */
export function QuoteIntroductionCard({
  introduction,
  errors,
  imageField,
  onChange,
  onAdvantageChange,
}: Props) {
  const at = errorsAt(errors, 'introduction');
  return (
    <QuoteSettingsCard
      title="КП для знайомства — рекламний каталог"
      description="Тексти каталогу, який надсилають новому клієнту, і головні моделі сторінок."
    >
      <QuoteSettingsGrid>
        {texts.map(({ key, label, wide, multiline }) => (
          <QuoteSettingsField
            key={key}
            label={label}
            wide={wide}
            multiline={multiline}
            value={introduction[key]}
            error={at(key)}
            onChange={(value) => onChange({ [key]: value })}
          />
        ))}
      </QuoteSettingsGrid>
      <Box sx={{ mt: 1.5 }}>
        <QuoteSettingsGrid>
          {imageField({
            label: 'Банер — літо',
            value: introduction.summerBannerUrl,
            error: at('summerBannerUrl'),
            onChange: (summerBannerUrl) => onChange({ summerBannerUrl }),
          })}
          {imageField({
            label: 'Банер — зима',
            value: introduction.winterBannerUrl,
            error: at('winterBannerUrl'),
            onChange: (winterBannerUrl) => onChange({ winterBannerUrl }),
          })}
        </QuoteSettingsGrid>
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
        Переваги
      </Typography>
      {at('advantages') && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {at('advantages')}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {introduction.advantages.map((advantage, index) => {
          const advantageAt = errorsAt(errors, `advantage:${index}`);
          return (
            <QuoteSettingsGrid key={index}>
              <QuoteSettingsField
                required
                label={`Перевага ${index + 1}`}
                value={advantage.title}
                error={advantageAt('title')}
                onChange={(title) => onAdvantageChange(index, { title })}
              />
              <QuoteSettingsField
                label="Пояснення"
                value={advantage.text}
                error={advantageAt('text')}
                onChange={(text) => onAdvantageChange(index, { text })}
              />
            </QuoteSettingsGrid>
          );
        })}
      </Box>
    </QuoteSettingsCard>
  );
}
