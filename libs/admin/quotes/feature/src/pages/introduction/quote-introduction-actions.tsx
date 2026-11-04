import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { Button } from '@mui/material';

interface Props {
  canDelete: boolean;
  onDelete: () => void;
  onRestart: () => void;
  onTemplates: () => void;
  onSaveTemplate: () => void;
}

/** Header actions of «КП для знайомства». */
export function QuoteIntroductionActions({
  canDelete,
  onDelete,
  onRestart,
  onTemplates,
  onSaveTemplate,
}: Props) {
  return (
    <>
      {canDelete && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineOutlinedIcon />}
          onClick={onDelete}
        >
          Видалити
        </Button>
      )}
      <Button startIcon={<AddOutlinedIcon />} onClick={onRestart}>
        Нова добірка
      </Button>
      <Button startIcon={<BookmarkAddOutlinedIcon />} onClick={onSaveTemplate}>
        Зберегти як шаблон
      </Button>
      <Button variant="outlined" startIcon={<LibraryBooksOutlinedIcon />} onClick={onTemplates}>
        Готові шаблони
      </Button>
    </>
  );
}
