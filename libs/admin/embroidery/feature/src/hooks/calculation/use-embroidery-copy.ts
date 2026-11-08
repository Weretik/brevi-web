import { embroideryPriceText, formatEmbroideryMoney } from '@admin/embroidery/model';
import { useState } from 'react';

import type { EmbroideryPrice } from '@admin/embroidery/model';

/**
 * «Копіювати»: the icon of a price copies only its unit price («203,04»); «Копіювати ціни» copies all of them as text
 * for a chat. The message is for the snackbar.
 */
export function useEmbroideryCopy() {
  const [message, setMessage] = useState<string | null>(null);
  const copy = async (
    prices: readonly EmbroideryPrice[],
    price: EmbroideryPrice | null,
    quantity: number,
  ) => {
    const text = price
      ? formatEmbroideryMoney(price.unit)
      : prices.map((item) => embroideryPriceText(item, quantity)).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setMessage(price ? `Ціну за 1 шт «${price.name}» скопійовано.` : 'Ціни скопійовано.');
    } catch {
      setMessage('Не вдалося скопіювати. Виділіть ціну вручну.');
    }
  };
  return { message, copy, show: setMessage, close: () => setMessage(null) };
}
