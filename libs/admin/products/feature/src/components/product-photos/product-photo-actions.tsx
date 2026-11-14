import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { ProductCardPhoto } from '@admin/products/model';

/** «Зробити головним», left, right and «Прибрати з товару» of one photo. */
export function ProductPhotoActions({
  photo,
  index,
  count,
  busy,
  onMain,
  onMove,
  onRemove,
}: {
  photo: ProductCardPhoto;
  index: number;
  count: number;
  busy: boolean;
  onMain: () => void;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <>
      {!photo.isMain && (
        <Tooltip title="Зробити головним">
          <IconButton
            size="small"
            disabled={busy}
            onClick={onMain}
            aria-label={`Зробити головним фото ${index + 1}`}
          >
            <StarBorderOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Лівіше">
        <span>
          <IconButton
            size="small"
            disabled={busy || index === 0}
            onClick={() => onMove(-1)}
            aria-label={`Посунути фото ${index + 1} лівіше`}
          >
            <ArrowBackOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Правіше">
        <span>
          <IconButton
            size="small"
            disabled={busy || index === count - 1}
            onClick={() => onMove(1)}
            aria-label={`Посунути фото ${index + 1} правіше`}
          >
            <ArrowForwardOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Прибрати з товару">
        <IconButton
          size="small"
          disabled={busy}
          onClick={onRemove}
          aria-label={`Прибрати фото ${index + 1}`}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}
