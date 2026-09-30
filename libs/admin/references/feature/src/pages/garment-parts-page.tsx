import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { GarmentPartOperationsContent } from './garment-part-operations-content';
import { GarmentPartsContent } from './garment-parts-content';

export function GarmentPartsPage() {
  const [tab, setTab] = useState(1);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Елементи виробу та роботи
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value: number) => setTab(value)}
        aria-label="Довідники елементів виробу"
        sx={{ mb: 2 }}
      >
        <Tab label="Елементи" id="garment-parts-tab" aria-controls="garment-parts-panel" />
        <Tab
          label="Роботи"
          id="garment-part-operations-tab"
          aria-controls="garment-part-operations-panel"
        />
      </Tabs>
      <Box
        role="tabpanel"
        id={tab === 0 ? 'garment-parts-panel' : 'garment-part-operations-panel'}
        aria-labelledby={tab === 0 ? 'garment-parts-tab' : 'garment-part-operations-tab'}
      >
        {tab === 0 ? <GarmentPartsContent /> : <GarmentPartOperationsContent />}
      </Box>
    </Box>
  );
}
