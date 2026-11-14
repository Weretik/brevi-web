import { Link } from '@mui/material';

/** «Ц-12» opening the order card of «Виробничі завдання». */
export function OrderLink({ orderId, orderNumber }: { orderId: number; orderNumber: number }) {
  return <Link href={`/production/orders/${orderId}`}>Ц-{orderNumber}</Link>;
}
