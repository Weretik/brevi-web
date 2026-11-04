import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Button, Card, Stack, Typography } from '@mui/material';

import type { LegalDocument } from '../../model/legal-documents';

interface LegalDocumentCardProps {
  document: LegalDocument;
  /** Full public address of the page. */
  publicUrl: string;
  onCopy: (url: string) => void;
}

export function LegalDocumentCard({ document, onCopy, publicUrl }: LegalDocumentCardProps) {
  return (
    <Card component="article" sx={{ p: 2.5 }} variant="outlined">
      <Stack spacing={1.5}>
        <div>
          <Typography component="h2" variant="h6">
            {document.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
            {document.description}
          </Typography>
        </div>
        <Typography
          sx={{
            color: 'text.secondary',
            fontFamily: 'var(--admin-font-mono)',
            wordBreak: 'break-all',
          }}
          variant="body2"
        >
          {publicUrl}
        </Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            component="a"
            href={document.path}
            rel="noopener"
            startIcon={<OpenInNewOutlinedIcon />}
            target="_blank"
            variant="outlined"
          >
            Відкрити
          </Button>
          <Button onClick={() => onCopy(publicUrl)} startIcon={<ContentCopyOutlinedIcon />}>
            Копіювати посилання
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
