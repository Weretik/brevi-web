import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/** «Ц-12» opening the order card of «Виробничі завдання». */
export function OrderLink({ orderId, orderNumber }: { orderId: number; orderNumber: number }) {
  return (
    <Link component={RouterLink} to={`/production/orders/${orderId}`}>
      Ц-{orderNumber}
    </Link>
  );
}
