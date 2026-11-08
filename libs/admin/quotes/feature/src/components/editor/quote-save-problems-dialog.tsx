import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import type { QuoteSaveProblem } from '@admin/quotes/model';

interface Props {
  problems: readonly QuoteSaveProblem[];
  /** Scrolls to the place of a problem; the dialog closes. */
  onGo: (target: string) => void;
  onClose: () => void;
}

/** «КП не збережено»: every reason in one list, so the manager sees what to fix before saving, sending or the PDF. */
export function QuoteSaveProblemsDialog({ problems, onGo, onClose }: Props) {
  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="quote-save-problems-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="quote-save-problems-title">КП не збережено</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>
          Виправте, будь ласка, і збережіть ще раз:
        </DialogContentText>
        <List dense disablePadding>
          {problems.map((problem) =>
            problem.target ? (
              <ListItemButton
                key={problem.text}
                onClick={() => {
                  onGo(problem.target ?? '');
                  onClose();
                }}
                sx={{ borderRadius: 1, color: 'error.main' }}
              >
                <ListItemText primary={problem.text} />
              </ListItemButton>
            ) : (
              <ListItemText
                key={problem.text}
                primary={problem.text}
                sx={{ px: 2, color: 'error.main' }}
              />
            ),
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Зрозуміло
        </Button>
      </DialogActions>
    </Dialog>
  );
}
