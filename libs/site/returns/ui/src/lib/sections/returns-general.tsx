import { ReturnsGroups } from './returns-groups';

import type { ReturnsDictionary } from '../i18n/returns-dictionary';

/** Text of the consumer protection law on the Verkhovna Rada site. */
const CONSUMER_LAW_URL = 'https://zakon.rada.gov.ua/laws/show/1023-12';

/** General rules: three groups, a link to the law they cite, and the closing sentence. */
export function ReturnsGeneral({ dictionary }: { dictionary: ReturnsDictionary['general'] }) {
  return (
    <div className="grid gap-6">
      <ReturnsGroups groups={dictionary.groups} />
      <a
        href={CONSUMER_LAW_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="justify-self-start font-bold text-brand-text hover:underline"
      >
        {dictionary.lawLink} <span aria-hidden>→</span>
      </a>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.closing}</p>
    </div>
  );
}
