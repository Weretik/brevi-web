import { useSearchParams } from 'react-router-dom';

/** The order opened in the side panel of «Виробничі завдання», kept in `?order=` so a link reopens it. */
export function useOrderQuickParam() {
  const [params, setParams] = useSearchParams();
  const orderId = Number(params.get('order')) || null;

  const set = (id: number | null) =>
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        if (id === null) copy.delete('order');
        else copy.set('order', String(id));
        return copy;
      },
      { replace: id === null },
    );

  return { orderId, open: (id: number) => set(id), close: () => set(null) };
}
