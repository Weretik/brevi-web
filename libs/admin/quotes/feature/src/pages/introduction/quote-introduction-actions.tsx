import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { Button } from '@mui/material';

interface Props {
  onRestart: () => void;
  onTemplates: () => void;
  onSaveTemplate: () => void;
}

/** Header actions of «КП для знайомства»; «Видалити» lives in «Ще». */
export function QuoteIntroductionActions({ onRestart, onTemplates, onSaveTemplate }: Props) {
  return (
    <>
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
