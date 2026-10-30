import type { IntroductionSlotDescriptor } from './introduction-layout';

/** Server-owned labels and blockers are displayed without client-side identity matching. */
export interface IntroductionSlotView {
  readonly slot: IntroductionSlotDescriptor;
  readonly productLabel: string | null;
  readonly fabricLabel: string | null;
  readonly blockers: readonly string[];
}
