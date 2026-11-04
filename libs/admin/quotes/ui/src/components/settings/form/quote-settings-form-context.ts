import { createContext, useContext } from 'react';

interface QuoteSettingsFormContextValue {
  /** The page shows this field on the preview: `pdf.ctaText`, `letter:<key>.body`, `staff:7.phone`. */
  onFocusField: (path: string) => void;
}

const noop: QuoteSettingsFormContextValue = { onFocusField: () => undefined };

export const QuoteSettingsFormContext = createContext<QuoteSettingsFormContextValue>(noop);

export const useQuoteSettingsForm = () => useContext(QuoteSettingsFormContext);
