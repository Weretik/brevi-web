import { Box, TextField, Typography } from '@mui/material';
import { Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

import type { ReactNodeViewProps } from '@tiptap/react';

/** A photo of the «Фото» library placed in a text; `src` is null when the library no longer has it. */
export interface RichTextImage {
  photoId: number;
  src: string | null;
  alt: string;
}

export const richTextAltMaxLength = 200;

function PhotoView({ node, editor, selected, updateAttributes }: ReactNodeViewProps) {
  const { src, alt } = node.attrs as RichTextImage;
  return (
    <NodeViewWrapper data-drag-handle>
      <Box
        component="figure"
        sx={{
          border: 1,
          borderColor: selected ? 'primary.main' : 'divider',
          borderRadius: 1,
          m: 0,
          my: 1,
          p: 1,
        }}
      >
        {src ? (
          <Box
            component="img"
            src={src}
            alt={alt}
            draggable={false}
            sx={{ display: 'block', maxHeight: 280, maxWidth: '100%', mx: 'auto' }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: 'warning.dark', py: 2, textAlign: 'center' }}>
            Цього фото вже немає в бібліотеці «Фото». Видаліть його з тексту або додайте інше.
          </Typography>
        )}
        <TextField
          fullWidth
          size="small"
          label="Опис фото"
          value={alt}
          disabled={!editor.isEditable}
          helperText="Що на фото, одним реченням: для пошуку Google і для тих, хто не бачить картинку."
          onChange={(event) => updateAttributes({ alt: event.target.value })}
          slotProps={{ htmlInput: { maxLength: richTextAltMaxLength } }}
          sx={{ mt: 1 }}
        />
      </Box>
    </NodeViewWrapper>
  );
}

/** A block with one photo of the library: the photo id, its address for the preview and the alt text. */
export const richTextPhoto = Node.create({
  name: 'photo',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      photoId: {
        default: null,
        parseHTML: (element) => Number(element.getAttribute('data-photo-id')) || null,
        renderHTML: (attributes) => ({ 'data-photo-id': String(attributes['photoId'] ?? '') }),
      },
      src: {
        default: null,
        parseHTML: (element) => element.querySelector('img')?.getAttribute('src') ?? null,
        renderHTML: () => ({}),
      },
      alt: {
        default: '',
        parseHTML: (element) => element.querySelector('img')?.getAttribute('alt') ?? '',
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'figure[data-photo-id]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const { src, alt } = node.attrs as RichTextImage;
    return ['figure', HTMLAttributes, ['img', { src: src ?? '', alt }]];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PhotoView);
  },
});
