import { Alert, Box, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { LegalDocumentCard } from '../../components/legal/legal-document-card';
import { legalDocuments, legalDocumentsEdition } from '../../model/legal-documents';

export default function LegalDocumentsPage() {
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice({ text: 'Посилання скопійовано.', ok: true });
    } catch {
      setNotice({ text: 'Не вдалося скопіювати. Виділіть посилання вручну.', ok: false });
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <div>
        <Typography component="h1" variant="h4">
          Конфіденційність та умови
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 720, mt: 0.5 }} variant="body2">
          Публічні документи BreviERP. Вони відкриваються без входу: на них посилається Google при
          підключенні Gmail. Редакція від {legalDocumentsEdition}.
        </Typography>
      </div>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {legalDocuments.map((document) => (
          <LegalDocumentCard
            document={document}
            key={document.id}
            onCopy={(url) => void copy(url)}
            publicUrl={new URL(document.path, window.location.origin).href}
          />
        ))}
      </Box>
      <Snackbar autoHideDuration={4000} onClose={() => setNotice(null)} open={notice !== null}>
        <Alert
          onClose={() => setNotice(null)}
          severity={notice?.ok === false ? 'error' : 'success'}
          variant="filled"
        >
          {notice?.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
