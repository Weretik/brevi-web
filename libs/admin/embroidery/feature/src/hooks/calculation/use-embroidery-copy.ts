import { embroideryPriceText } from '@admin/embroidery/model';
import { useState } from 'react';

import type { EmbroideryPrice } from '@admin/embroidery/model';

/** «Копіювати»: one price or all of them as text for a chat, with a message for the snackbar. */
export function useEmbroideryCopy() {
  const [message, setMessage] = useState<string | null>(null);
  const copy = async (
    prices: readonly EmbroideryPrice[],
    price: EmbroideryPrice | null,
    quantity: number,
  ) => {
    const text = (price ? [price] : prices)
      .map((item) => embroideryPriceText(item, quantity))
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setMessage(price ? `Ціну «${price.name}» скопійовано.` : 'Ціни скопійовано.');
    } catch {
      setMessage('Не вдалося скопіювати. Виділіть ціну вручну.');
    }
  };
  return { message, copy, show: setMessage, close: () => setMessage(null) };
}
