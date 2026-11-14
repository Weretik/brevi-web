import { Box } from '@mui/material';
import Markdown from 'react-markdown';

interface Props {
  text: string;
}

const allowedElements = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'strong',
  'em',
];

export function ProductMarkdown({ text }: Props) {
  return (
    <Box sx={{ overflowWrap: 'anywhere', '& a': { color: 'primary.main' } }}>
      <Markdown skipHtml allowedElements={allowedElements}>
        {text}
      </Markdown>
    </Box>
  );
}
