import { quoteMaxLetterVariants } from '@admin/quotes/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

import { QuoteLetterEditor } from './quote-letter-editor';
import { errorsAt, quoteSettingsProblemsLabel } from '../form/quote-settings-layout';

import type {
  QuoteEmailTemplateDraft,
  QuoteLetterVariantDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';
import type { ReactNode } from 'react';

/** The open letter: `main` is the letter every КП gets, otherwise a variant key. */
export type QuoteLetterRef = 'main' | string;

interface Props {
  email: QuoteEmailTemplateDraft;
  savedEmail: QuoteEmailTemplateDraft;
  variants: readonly QuoteLetterVariantDraft[];
  savedVariants: readonly QuoteLetterVariantDraft[];
  errors: QuoteSettingsErrors;
  open: QuoteLetterRef | null;
  onOpen: (letter: QuoteLetterRef | null) => void;
  onEmailChange: (patch: Partial<QuoteEmailTemplateDraft>) => void;
  onAdd: () => void;
  onChange: (key: string, patch: Partial<QuoteLetterVariantDraft>) => void;
  onRemove: (key: string) => void;
}

const problemsOf = (errors: QuoteSettingsErrors, prefix: string) =>
  Object.keys(errors).filter((path) => path.startsWith(`${prefix}.`)).length;

/** «Лист клієнту»: the main letter and the variants as one list; a row opens its fields in place. */
export function QuoteLettersSection({
  email,
  savedEmail,
  variants,
  savedVariants,
  errors,
  open,
  onOpen,
  onEmailChange,
  onAdd,
  onChange,
  onRemove,
}: Props) {
  const row = (
    ref: QuoteLetterRef,
    title: string,
    subject: string,
    problems: number,
    tag: string | null,
    editor: ReactNode,
  ) => {
    const isOpen = open === ref;
    return (
      <Box
        key={ref}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          '&:first-of-type': { borderTop: 0 },
          ...(isOpen && { bgcolor: 'action.hover' }),
        }}
      >
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', px: 2, py: 1.25 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 700 }}>{title || 'Без назви'}</Typography>
              {tag && <Chip size="small" label={tag} />}
            </Stack>
            <Typography variant="body2" color="text.secondary" noWrap>
              {subject || 'Тема не вказана'}
            </Typography>
          </Box>
          {problems > 0 && (
            <Typography variant="body2" color="error" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {quoteSettingsProblemsLabel(problems)}
            </Typography>
          )}
          <Button
            onClick={() => onOpen(isOpen ? null : ref)}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Згорнути' : 'Змінити'}: ${title || 'шаблон без назви'}`}
            sx={{ flexShrink: 0 }}
          >
            {isOpen ? 'Згорнути' : 'Змінити'}
          </Button>
        </Stack>
        {isOpen && editor}
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {row(
          'main',
          'Основний лист',
          email.subject,
          problemsOf(errors, 'email'),
          'Підставляється сам',
          <QuoteLetterEditor
            path="email"
            letter={email}
            saved={savedEmail}
            errorOf={errorsAt(errors, 'email')}
            onChange={onEmailChange}
          />,
        )}
        {variants.map((variant) => {
          const at = errorsAt(errors, `letter:${variant.key}`);
          const saved = savedVariants.find((item) => item.key === variant.key);
          return row(
            variant.key,
            variant.name,
            variant.subject,
            problemsOf(errors, `letter:${variant.key}`),
            null,
            <QuoteLetterEditor
              path={`letter:${variant.key}`}
              name={{ value: variant.name, saved: saved?.name, error: at('name') }}
              letter={variant}
              saved={saved}
              errorOf={at}
              onNameChange={(name) => onChange(variant.key, { name })}
              onChange={(patch) => onChange(variant.key, patch)}
              onRemove={() => onRemove(variant.key)}
            />,
          );
        })}
      </Box>
      {errors['letterVariants'] && (
        <Typography variant="body2" color="error">
          {errors['letterVariants']}
        </Typography>
      )}
      <Button
        variant="outlined"
        startIcon={<AddOutlinedIcon />}
        onClick={onAdd}
        disabled={variants.length >= quoteMaxLetterVariants}
        sx={{ alignSelf: 'flex-start' }}
      >
        Додати шаблон
      </Button>
    </>
  );
}
