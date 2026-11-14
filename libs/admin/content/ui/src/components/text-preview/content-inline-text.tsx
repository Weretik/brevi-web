import { inlineRuns } from '@admin/content/model';
import { Box } from '@mui/material';

/** A stored string with its bold and italic parts shown as formatting. */
export function ContentInlineText({ text }: { text: string | null }) {
  return inlineRuns(text ?? '').map((run, index) => (
    <Box
      key={index}
      component={run.bold ? 'strong' : run.italic ? 'em' : 'span'}
      sx={{ fontStyle: run.italic ? 'italic' : undefined }}
    >
      {run.text}
    </Box>
  ));
}
