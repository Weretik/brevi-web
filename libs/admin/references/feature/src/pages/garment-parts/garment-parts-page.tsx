import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { GarmentPartsContent } from './garment-parts-content';
import { GarmentPartOperationsContent } from '../garment-part-operations/garment-part-operations-content';

export function GarmentPartsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'parts' ? 0 : 1;

  function selectTab(value: number) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('tab', value === 0 ? 'parts' : 'operations');
    setSearchParams(nextSearchParams);
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Елементи виробу та роботи
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value: number) => selectTab(value)}
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

export default GarmentPartsPage;
