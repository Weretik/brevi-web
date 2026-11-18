import { QuoteRecipientCard } from '@admin/quotes/ui';
import { Box, Stack } from '@mui/material';

import { QuoteEditorAside } from './quote-editor-aside';
import { QuoteEditorItems } from '../../components/editor/quote-editor-items';

import type { QuoteWorkshopCard } from './quote-supplier-card';
import type { useQuoteEditorPage } from '../../hooks/editor/use-quote-editor-page';
import type { QuoteActor } from '@admin/quotes/model';

interface Props {
  page: ReturnType<typeof useQuoteEditorPage>;
  actor: QuoteActor;
  workshopCard?: QuoteWorkshopCard;
  /** Scrolls to the header, the items or one item. */
  onGo: (target: string) => void;
}

/** The two columns of the editor: recipient and items on the left, the summary, actions and «Цех» on the right. */
export function QuoteEditorWorkspace({ page, actor, workshopCard: WorkshopCard, onGo }: Props) {
  const {
    navigate,
    editor,
    clients,
    wide,
    setPanel,
    fabricFacts,
    openSupplier,
    saveFirst,
    actions,
  } = page;
  const { quote, draft } = editor;
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        alignItems: 'start',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
      }}
    >
      <Stack sx={{ gap: 2, minWidth: 0 }}>
        <QuoteRecipientCard
          draft={draft}
          clients={clients.clients}
          headerError={editor.errors['header']}
          onChange={editor.change}
          onClientSearch={clients.search}
        />
        <QuoteEditorItems
          editor={editor}
          fabricFacts={fabricFacts}
          onOpenSupplier={openSupplier}
          onPanel={setPanel}
        />
      </Stack>
      <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
        <Stack sx={{ gap: 2 }}>
          <QuoteEditorAside
            draft={draft}
            withActions={wide}
            onTierShown={editor.setTierShown}
            onGo={onGo}
            {...actions}
          />
          {WorkshopCard && (
            <WorkshopCard
              quoteId={quote?.id ?? null}
              canCreate={actor.canPassToWorkshop === true && draft.items.length > 0}
              onPass={() =>
                saveFirst.run((saved) => navigate(`/production/orders/new?quote=${saved.id}`))
              }
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
