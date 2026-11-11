import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RedoIcon from '@mui/icons-material/Redo';
import TitleIcon from '@mui/icons-material/Title';
import UndoIcon from '@mui/icons-material/Undo';
import { Divider, Stack, ToggleButton, Tooltip } from '@mui/material';
import { useEditorState } from '@tiptap/react';

import type { Editor } from '@tiptap/react';
import type { ReactNode } from 'react';

interface ToolButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToolButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick,
}: ToolButtonProps) {
  return (
    <Tooltip title={label}>
      <span>
        <ToggleButton
          aria-label={label}
          disabled={disabled}
          onChange={onClick}
          // Keeps the text selection in the editor while the button is pressed.
          onMouseDown={(event) => event.preventDefault()}
          selected={active}
          size="small"
          sx={{ border: 0, minWidth: 36 }}
          value={label}
        >
          {children}
        </ToggleButton>
      </span>
    </Tooltip>
  );
}

interface RichTextToolbarProps {
  editor: Editor;
  disabled: boolean;
  /** Shows «Фото»: the text may have photos of the library. */
  onPhoto?: (() => void) | undefined;
}

/** Buttons of the text editor: heading, bold, italic, list, photo (when allowed), undo and redo. */
export function RichTextToolbar({ editor, disabled, onPhoto }: RichTextToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      heading: current.isActive('heading'),
      list: current.isActive('bulletList'),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  return (
    <Stack
      aria-label="Форматування тексту"
      direction="row"
      role="toolbar"
      sx={{ borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 0.5, p: 0.5 }}
    >
      <ToolButton
        active={state.heading}
        disabled={disabled}
        label="Заголовок"
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        <TitleIcon fontSize="small" />
      </ToolButton>
      <Divider flexItem orientation="vertical" />
      <ToolButton
        active={state.bold}
        disabled={disabled}
        label="Жирний"
        onClick={() => chain().toggleBold().run()}
      >
        <FormatBoldIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        active={state.italic}
        disabled={disabled}
        label="Курсив"
        onClick={() => chain().toggleItalic().run()}
      >
        <FormatItalicIcon fontSize="small" />
      </ToolButton>
      <Divider flexItem orientation="vertical" />
      <ToolButton
        active={state.list}
        disabled={disabled}
        label="Список"
        onClick={() => chain().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolButton>
      {onPhoto && (
        <>
          <Divider flexItem orientation="vertical" />
          <ToolButton disabled={disabled} label="Фото" onClick={onPhoto}>
            <AddPhotoAlternateOutlinedIcon fontSize="small" />
          </ToolButton>
        </>
      )}
      <Divider flexItem orientation="vertical" />
      <ToolButton
        disabled={disabled || !state.canUndo}
        label="Скасувати дію"
        onClick={() => chain().undo().run()}
      >
        <UndoIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        disabled={disabled || !state.canRedo}
        label="Повторити дію"
        onClick={() => chain().redo().run()}
      >
        <RedoIcon fontSize="small" />
      </ToolButton>
    </Stack>
  );
}
