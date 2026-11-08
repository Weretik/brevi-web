import type { LeadDetail } from '../entities/lead';

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const sentence = (text: string) => text.trim().replace(/[.\s]+$/, '');

/**
 * «Що сказати» of «Мій день»: an opening built from the AI's signal, what to offer and whom to ask, so a
 * manager starts the call without reading the whole card. Missing parts are left out.
 */
export function leadScript(
  lead: Pick<LeadDetail, 'signal' | 'offer' | 'whomToCall' | 'company'>,
): string {
  const parts = ['Добрий день! Це Brevi, ми шиємо робочий одяг і спецодяг.'];
  if (lead.signal)
    parts.push(`Побачили, що у ${lead.company}: ${lowerFirst(sentence(lead.signal))}.`);
  if (lead.offer) parts.push(`Можемо запропонувати: ${lowerFirst(sentence(lead.offer))}.`);
  parts.push(
    lead.whomToCall
      ? `Підкажіть, будь ласка, з ким поговорити: ${lowerFirst(sentence(lead.whomToCall))}?`
      : 'Підкажіть, будь ласка, хто у вас відповідає за закупівлю робочого одягу?',
  );
  return parts.join(' ');
}
