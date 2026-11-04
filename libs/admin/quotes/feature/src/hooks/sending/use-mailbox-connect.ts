import { useConnectMailboxMutation, useDisconnectMailboxMutation } from '@admin/quotes/data-access';
import { useState } from 'react';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/**
 * «Підключити Gmail»: asks the server for the Google page and opens it in this tab; Google brings the person back
 * to `returnPath` with `?gmail=…`. «Відключити» forgets the address.
 */
export function useMailboxConnect(returnPath: string) {
  const [connect, connecting] = useConnectMailboxMutation();
  const [disconnect, disconnecting] = useDisconnectMailboxMutation();
  const [error, setError] = useState<string | null>(null);

  return {
    busy: connecting.isLoading || disconnecting.isLoading,
    error,
    connect: async (userId: number) => {
      setError(null);
      try {
        const url = await connect({ userId, returnPath }).unwrap();
        window.location.assign(url);
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося відкрити сторінку Google.'));
      }
    },
    disconnect: async (userId: number) => {
      setError(null);
      try {
        await disconnect(userId).unwrap();
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося відключити Gmail.'));
      }
    },
  };
}
