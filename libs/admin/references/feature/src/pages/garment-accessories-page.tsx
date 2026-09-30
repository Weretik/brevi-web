import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { FabricsPage } from './fabrics-page';
import { GarmentAccessoriesContent } from './garment-accessories-content';

export function GarmentAccessoriesPage() {
  const [tab, setTab] = useState(0);

  return <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
    <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Фурнітура</Typography>
    <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Довідники фурнітури">
      <Tab label="Фурнітура виробу" id="accessories-tab" aria-controls="accessories-panel" />
      <Tab label="Тканини" id="fabrics-tab" aria-controls="fabrics-panel" />
    </Tabs>
    <Box role="tabpanel" id={tab === 0 ? 'accessories-panel' : 'fabrics-panel'} aria-labelledby={tab === 0 ? 'accessories-tab' : 'fabrics-tab'}>
      {tab === 0 ? <GarmentAccessoriesContent /> : <FabricsPage />}
    </Box>
  </Box>;
}
