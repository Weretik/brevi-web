import { Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

import type { Product } from '@admin/products/model';

interface Props {
  anchorPosition: { left: number; top: number } | null;
  product: Product | null;
  onClose: () => void;
  onDelete: (product: Product) => void;
}

export function ProductRowContextMenu({ anchorPosition, onClose, onDelete, product }: Props) {
  return (
    <Menu
      anchorPosition={anchorPosition ?? undefined}
      anchorReference="anchorPosition"
      open={product !== null}
      onClose={onClose}
      slotProps={{ list: { 'aria-label': product ? `Дії товару ${product.name}` : 'Дії товару' } }}
    >
      <MenuItem component={Link} to={`/references/products/${product?.id ?? ''}`} onClick={onClose}>
        Перегляд
      </MenuItem>
      <MenuItem
        component={Link}
        to={`/references/products/${product?.id ?? ''}/edit`}
        onClick={onClose}
      >
        Змінити
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (product) onDelete(product);
          onClose();
        }}
      >
        Видалити
      </MenuItem>
    </Menu>
  );
}
