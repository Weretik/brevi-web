import {
  PpeCreateGuideCard,
  PpeCreateHeader,
  PpeCreatePriceFields,
  PpeCreatePricePreviewCard,
  PpeCreateProductFields,
  PpeCreatePublicationFields,
  PpeCreateReadinessCard,
  PpeCreateSupplierFields,
} from '@admin/products/ui';
import { Alert, Box, Button, Stack } from '@mui/material';

import { usePpeCreateForm } from '../../hooks/ppe-create/use-ppe-create-form';
import { usePpeCreateLookups } from '../../hooks/ppe-create/use-ppe-create-lookups';
import { usePpeCreateSubmit } from '../../hooks/ppe-create/use-ppe-create-submit';
import { usePpePricePreview } from '../../hooks/ppe-create/use-ppe-price-preview';

const listHref = '/references/products?tab=ppe';

/** «Новий ЗІЗ» (CAT-009): the four blocks of the sheet instruction and a sticky summary. */
export function PpeCreatePage() {
  const lookups = usePpeCreateLookups();
  const form = usePpeCreateForm();
  const { values } = form;
  const preview = usePpePricePreview(
    values.ruleCode,
    values.supplierPrice,
    !form.ruleErrors.supplierPrice,
  );
  const submit = usePpeCreateSubmit(form.setServerErrors);
  const rule = lookups.rules.find((item) => item.name === values.ruleCode) ?? null;
  const fields = {
    values,
    errors: form.errors,
    disabled: submit.saving,
    onChange: form.change,
  };

  return (
    <Box
      component="form"
      noValidate
      aria-label="Новий ЗІЗ"
      onSubmit={(event) => {
        event.preventDefault();
        if (form.canSubmit && !submit.saving) void submit.submit(values);
      }}
      sx={{ display: 'grid', gap: 2, minWidth: 0 }}
    >
      <PpeCreateHeader listHref={listHref} canSubmit={form.canSubmit} saving={submit.saving} />
      {lookups.error && (
        <Alert severity="error" action={<Button onClick={lookups.reload}>Повторити</Button>}>
          {lookups.error}
        </Alert>
      )}
      {submit.message && <Alert severity="error">{submit.message}</Alert>}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
          alignItems: 'start',
        }}
      >
        <Stack sx={{ gap: 2, minWidth: 0 }}>
          <PpeCreateProductFields
            {...fields}
            sections={lookups.sections}
            codeNote={form.codeNote}
          />
          <PpeCreateSupplierFields {...fields} suppliers={lookups.suppliers} />
          <PpeCreatePriceFields {...fields} rules={lookups.rules} />
          <PpeCreatePublicationFields {...fields} />
        </Stack>
        <Stack
          component="aside"
          aria-label="Підсумок"
          sx={{ gap: 2, position: { lg: 'sticky' }, top: { lg: 88 } }}
        >
          <PpeCreateReadinessCard items={form.readiness} />
          <PpeCreatePricePreviewCard {...preview} priceNote={rule?.priceNote ?? null} />
          <PpeCreateGuideCard />
        </Stack>
      </Box>
    </Box>
  );
}

export default PpeCreatePage;
