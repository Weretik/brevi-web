import { Paper, Typography } from '@mui/material';

export function StartPage() {
  return (
    <Paper sx={{ p: { xs: 3, sm: 5 } }}>
      <Typography component="h1" gutterBottom variant="h4">
        Робочий простір адміністратора
      </Typography>
      <Typography color="text.secondary">
        Доступні розділи відображатимуться в навігації.
      </Typography>
    </Paper>
  );
}
