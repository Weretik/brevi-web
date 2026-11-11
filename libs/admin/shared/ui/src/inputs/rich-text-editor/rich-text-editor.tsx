import { Box, FormHelperText, Typography } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useId } from 'react';

import { richTextExtensions, richTextWithPhotoExtensions } from './rich-text-extensions';
import { RichTextToolbar } from './rich-text-toolbar';

import type { RichTextImage } from './rich-text-photo';

/** The document of the editor (ProseMirror JSON): paragraphs, headings, lists, bold and italic text. */
export interface RichTextDocument {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: RichTextDocument[];
  text?: string;
  marks?: { type: string }[];
}

interface RichTextEditorProps {
  label: string;
  /** The text the editor opens with. To show another text, give the editor another `key`. */
  initialValue: RichTextDocument;
  onChange: (value: RichTextDocument) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  /**
   * Lets the text have photos: «Фото» of the toolbar calls this, and the caller hands the chosen
   * photos of the library to `insert`. Must be given from the first render or not at all.
   */
  onPickImages?: (insert: (images: RichTextImage[]) => void) => void;
}

/**
 * Visual text editor of the Admin: staff format the text with the toolbar or the usual keys
 * (Ctrl+B, Ctrl+I) and never type markup. Every long text shown on the site is edited here.
 */
export function RichTextEditor({
  label,
  initialValue,
  onChange,
  disabled = false,
  error = false,
  helperText,
  onPickImages,
}: RichTextEditorProps) {
  const labelId = useId();
  const editor = useEditor({
    content: initialValue,
    editable: !disabled,
    editorProps: {
      attributes: { 'aria-labelledby': labelId, 'aria-multiline': 'true', role: 'textbox' },
    },
    extensions: onPickImages ? richTextWithPhotoExtensions : richTextExtensions,
    immediatelyRender: true,
    onUpdate: ({ editor: current }) => onChange(current.getJSON() as RichTextDocument),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <Box>
      <Typography
        color={error ? 'error' : 'text.secondary'}
        id={labelId}
        sx={{ display: 'block', mb: 0.5 }}
        variant="caption"
      >
        {label}
      </Typography>
      <Box
        sx={(theme) => ({
          border: 1,
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          '&:focus-within': { borderColor: error ? 'error.main' : 'primary.main' },
          '& .ProseMirror': {
            minHeight: 180,
            outline: 'none',
            p: 1.5,
            ...theme.typography.body2,
          },
          '& .ProseMirror h2': { ...theme.typography.subtitle1, fontWeight: 700, mb: 1, mt: 2 },
          '& .ProseMirror h2:first-of-type': { mt: 0 },
          '& .ProseMirror p': { my: 1 },
          '& .ProseMirror ul': { my: 1, pl: 2.5 },
          '& .ProseMirror-selectednode': { outline: 'none' },
        })}
      >
        <RichTextToolbar
          editor={editor}
          disabled={disabled}
          onPhoto={
            onPickImages
              ? () =>
                  onPickImages((images) =>
                    editor
                      .chain()
                      .focus()
                      .insertContent(images.map((attrs) => ({ type: 'photo', attrs })))
                      .run(),
                  )
              : undefined
          }
        />
        <EditorContent editor={editor} />
      </Box>
      {helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
    </Box>
  );
}
