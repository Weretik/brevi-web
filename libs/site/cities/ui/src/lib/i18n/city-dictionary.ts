import { CITY_DICTIONARY_RU } from './city-dictionary-ru';
import { CITY_DICTIONARY_UK } from './city-dictionary-uk';

import type { CityDictionary } from './city-dictionary-uk';
import type { Locale } from '@site/core/i18n';

export type { CityDictionary } from './city-dictionary-uk';

/** Text of the blocks shared by the «Пошиття» and «Робочий одяг» city pages in one language. */
export function getCityDictionary(locale: Locale): CityDictionary {
  return locale === 'ru' ? CITY_DICTIONARY_RU : CITY_DICTIONARY_UK;
}
