import {
  QuoteIntroLayoutStep,
  QuoteIntroLetterStep,
  QuoteIntroPagesStep,
  QuoteIntroRecipientStep,
} from '@admin/quotes/ui';
import { Box, Stack } from '@mui/material';

import type { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import type {
  QuoteIntroductionSetup,
  QuoteIntroDraft,
  QuoteIntroSeason,
  QuoteIntroSlotDraft,
} from '@admin/quotes/model';

export const quoteIntroRecipientAnchor = 'quote-intro-recipient';
export const quoteIntroPagesAnchor = 'quote-intro-pages';

interface Props {
  editor: ReturnType<typeof useQuoteIntroductionEditor>;
  draft: QuoteIntroDraft;
  setup: QuoteIntroductionSetup;
  onPick: (season: QuoteIntroSeason, slot: QuoteIntroSlotDraft) => void;
}

/** The steps of «КП для знайомства»: layout, recipient, letter and the season pages with models. */
export function QuoteIntroductionSteps({ editor, draft, setup, onPick }: Props) {
  const mainProblems = {
    Summer: setup.summer.problem ?? undefined,
    Winter: setup.winter.problem ?? undefined,
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <QuoteIntroLayoutStep layout={draft.layout} onChange={editor.setLayout} />
      <Box id={quoteIntroRecipientAnchor} sx={{ scrollMarginTop: 96 }}>
        <QuoteIntroRecipientStep draft={draft} errors={editor.errors} onChange={editor.change} />
      </Box>
      <QuoteIntroLetterStep
        letters={setup.letters}
        letterName={draft.letterName}
        letterSubject={draft.letterSubject}
        letterBody={draft.letterBody}
        onChange={(letterName) => {
          if (letterName !== draft.letterName)
            editor.change({ letterName, letterSubject: null, letterBody: null });
        }}
        onEditLetter={editor.change}
      />
      <Box id={quoteIntroPagesAnchor} sx={{ scrollMarginTop: 96 }}>
        <QuoteIntroPagesStep
          pages={draft.pages}
          products={editor.products}
          errors={editor.errors}
          mainProblems={mainProblems}
          onPick={onPick}
          onFabric={editor.chooseFabric}
          onClear={editor.clearSlot}
        />
      </Box>
    </Stack>
  );
}
