import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { GarmentAccessoriesContent } from './garment-accessories-content';
import { FabricsPage } from '../fabrics/fabrics-page';

export function GarmentAccessoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'fabrics' ? 1 : 0;

  function selectTab(value: number) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('tab', value === 1 ? 'fabrics' : 'accessories');
    setSearchParams(nextSearchParams);
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Фурнітура
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value: number) => selectTab(value)}
        aria-label="Довідники фурнітури"
      >
        <Tab label="Фурнітура виробу" id="accessories-tab" aria-controls="accessories-panel" />
        <Tab label="Тканини" id="fabrics-tab" aria-controls="fabrics-panel" />
      </Tabs>
      <Box
        role="tabpanel"
        id={tab === 0 ? 'accessories-panel' : 'fabrics-panel'}
        aria-labelledby={tab === 0 ? 'accessories-tab' : 'fabrics-tab'}
      >
        {tab === 0 ? <GarmentAccessoriesContent /> : <FabricsPage />}
      </Box>
    </Box>
  );
}

export default GarmentAccessoriesPage;
