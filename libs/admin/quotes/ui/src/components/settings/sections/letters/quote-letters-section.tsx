import { quoteMaxLetterVariants } from '@admin/quotes/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Typography } from '@mui/material';

import { QuoteLetterEditor } from './quote-letter-editor';
import { QuoteLetterRow } from './quote-letter-row';
import { errorsAt } from '../../form/quote-settings-layout';

import type {
  QuoteEmailTemplateDraft,
  QuoteLetterVariantDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';

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
  return (
    <>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <QuoteLetterRow
          title="Основний лист"
          subject={email.subject}
          problems={problemsOf(errors, 'email')}
          tag="Підставляється сам"
          open={open === 'main'}
          onToggle={() => onOpen(open === 'main' ? null : 'main')}
        >
          <QuoteLetterEditor
            path="email"
            letter={email}
            saved={savedEmail}
            errorOf={errorsAt(errors, 'email')}
            onChange={onEmailChange}
          />
        </QuoteLetterRow>
        {variants.map((variant) => {
          const at = errorsAt(errors, `letter:${variant.key}`);
          const saved = savedVariants.find((item) => item.key === variant.key);
          return (
            <QuoteLetterRow
              key={variant.key}
              title={variant.name}
              subject={variant.subject}
              problems={problemsOf(errors, `letter:${variant.key}`)}
              tag={null}
              open={open === variant.key}
              onToggle={() => onOpen(open === variant.key ? null : variant.key)}
            >
              <QuoteLetterEditor
                path={`letter:${variant.key}`}
                name={{ value: variant.name, saved: saved?.name, error: at('name') }}
                letter={variant}
                saved={saved}
                errorOf={at}
                onNameChange={(name) => onChange(variant.key, { name })}
                onChange={(patch) => onChange(variant.key, patch)}
                onRemove={() => onRemove(variant.key)}
              />
            </QuoteLetterRow>
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
