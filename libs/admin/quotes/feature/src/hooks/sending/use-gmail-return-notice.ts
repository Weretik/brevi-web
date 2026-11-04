import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface GmailNotice {
  severity: 'success' | 'error';
  text: string;
}

const reasons: Record<string, string> = {
  expired: 'Час на підключення минув. Спробуйте ще раз.',
  denied: 'У Google не надали доступ до надсилання.',
  google: 'Google не підтвердив доступ. Спробуйте ще раз і дозвольте «Надсилати листи».',
  twice: 'Gmail підключали двічі одночасно. Оновіть сторінку.',
};

/** Reads `?gmail=connected|error&reason=…` that the Google callback adds, shows it once and cleans the address. */
export function useGmailReturnNotice() {
  const [params, setParams] = useSearchParams();
  const [notice, setNotice] = useState<GmailNotice | null>(null);
  const outcome = params.get('gmail');
  const reason = params.get('reason');

  useEffect(() => {
    if (!outcome) return;
    setNotice(
      outcome === 'connected'
        ? { severity: 'success', text: 'Gmail підключено. Тепер з нього можна надсилати КП.' }
        : { severity: 'error', text: reasons[reason ?? ''] ?? 'Не вдалося підключити Gmail.' },
    );
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete('gmail');
        next.delete('reason');
        return next;
      },
      { replace: true },
    );
  }, [outcome, reason, setParams]);

  return { notice, dismiss: () => setNotice(null) };
}
