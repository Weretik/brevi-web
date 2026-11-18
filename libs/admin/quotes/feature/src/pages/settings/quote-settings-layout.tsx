import { QuoteSettingsNav, QuoteSettingsPreview } from '@admin/quotes/ui';
import { Box, Drawer } from '@mui/material';

import { QuoteSettingsContent } from '../../components/settings/quote-settings-content';

import type { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import type { useQuoteSettingsPreview } from '../../hooks/settings/use-quote-settings-preview';
import type { useSettingsSections } from '../../hooks/settings/use-settings-sections';
import type { ComponentProps } from 'react';

interface Props {
  editor: ComponentProps<typeof QuoteSettingsContent>['editor'];
  sections: ReturnType<typeof useSettingsSections>;
  mailbox: ReturnType<typeof useMailboxConnect>;
  previewState: ReturnType<typeof useQuoteSettingsPreview>;
  /** The section list is a column on the left. */
  wideNav: boolean;
  /** The preview is a third column; otherwise it opens in a side panel. */
  widePreview: boolean;
  previewOpen: boolean;
  onPreviewClose: () => void;
  onEditManager: (userId: number) => void;
}

/** Sections, the settings and the client preview, in up to three columns. */
export function QuoteSettingsLayout({
  editor,
  sections,
  mailbox,
  previewState,
  wideNav,
  widePreview,
  previewOpen,
  onPreviewClose,
  onEditManager,
}: Props) {
  const { draft } = editor;
  const { focused, view, openLetter, setView, openLetterRow } = previewState;
  const preview = (
    <QuoteSettingsPreview
      draft={draft}
      view={view}
      letter={openLetter}
      focused={focused}
      onViewChange={setView}
    />
  );

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: widePreview
            ? '200px minmax(0, 1fr) 380px'
            : wideNav
              ? '200px minmax(0, 1fr)'
              : 'minmax(0, 1fr)',
        }}
      >
        <Box sx={wideNav ? { position: 'sticky', top: 88 } : undefined}>
          <QuoteSettingsNav
            active={sections.active}
            changed={editor.changed}
            errorCounts={editor.errorCounts}
            layout={wideNav ? 'column' : 'row'}
            onSelect={sections.goTo}
          />
        </Box>
        <QuoteSettingsContent
          editor={editor}
          mailbox={mailbox}
          openLetter={openLetter}
          onOpenLetter={openLetterRow}
          onEditManager={onEditManager}
        />
        {widePreview && <Box sx={{ position: 'sticky', top: 88 }}>{preview}</Box>}
      </Box>
      {!widePreview && (
        <Drawer
          anchor="right"
          open={previewOpen}
          onClose={onPreviewClose}
          slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 }, p: 2.5 } } }}
        >
          {preview}
        </Drawer>
      )}
    </>
  );
}
