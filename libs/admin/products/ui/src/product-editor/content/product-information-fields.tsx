import { moveOrdered, removeOrdered } from '@admin/products/model';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
}
export function ProductInformationFields({ draft, setDraft, errors }: Props) {
  function blockField(
    index: number,
    field: 'titleUk' | 'titleRu' | 'textUk' | 'textRu',
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      informationBlocks: (current.informationBlocks ?? []).map((item, position) =>
        position === index ? { ...item, [field]: value } : item,
      ),
    }));
  }
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Інформаційні блоки</Typography>
      {errors['informationBlocks'] && <Alert severity="error">{errors['informationBlocks']}</Alert>}
      {(draft.informationBlocks ?? []).map((block, index) => (
        <Box key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <TextField
              label="Заголовок українською"
              value={block.titleUk}
              onChange={(event) => blockField(index, 'titleUk', event.target.value)}
            />
            <TextField
              label="Заголовок російською"
              value={block.titleRu}
              onChange={(event) => blockField(index, 'titleRu', event.target.value)}
            />
            <TextField
              label="Текст українською"
              value={block.textUk}
              multiline
              minRows={2}
              onChange={(event) => blockField(index, 'textUk', event.target.value)}
            />
            <TextField
              label="Текст російською"
              value={block.textRu}
              multiline
              minRows={2}
              onChange={(event) => blockField(index, 'textRu', event.target.value)}
            />
            <Stack direction="row">
              <Button
                disabled={index === 0}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    informationBlocks: moveOrdered(current.informationBlocks ?? [], index, -1),
                  }))
                }
              >
                Вгору
              </Button>
              <Button
                disabled={index === (draft.informationBlocks ?? []).length - 1}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    informationBlocks: moveOrdered(current.informationBlocks ?? [], index, 1),
                  }))
                }
              >
                Вниз
              </Button>
            </Stack>
            <Button
              color="error"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  informationBlocks: removeOrdered(current.informationBlocks ?? [], index),
                }))
              }
            >
              Прибрати блок
            </Button>
          </Stack>
        </Box>
      ))}
      <Button
        onClick={() =>
          setDraft((current) => ({
            ...current,
            informationBlocks: [
              ...(current.informationBlocks ?? []),
              {
                titleUk: '',
                titleRu: '',
                textUk: '',
                textRu: '',
                sortOrder: (current.informationBlocks ?? []).length,
              },
            ],
          }))
        }
      >
        Додати блок
      </Button>
    </Stack>
  );
}
