export type IntroductionFormat = 'general' | 'summer' | 'winter';
export type IntroductionSeason = 'summer' | 'winter';

export interface IntroductionSlotDescriptor {
  readonly key: string;
  readonly season: IntroductionSeason;
  readonly position: 1 | 2 | 3 | 4;
  readonly featured: boolean;
}

/** Display positions only; product and featured identities belong to the backend. */
export function introductionLayout(
  format: IntroductionFormat,
): readonly IntroductionSlotDescriptor[] {
  const seasons: readonly IntroductionSeason[] =
    format === 'general' ? ['summer', 'winter'] : [format];
  return seasons.flatMap((season) =>
    ([1, 2, 3, 4] as const).map((position) => ({
      key: `${season}-${position}`,
      season,
      position,
      featured: position === 1,
    })),
  );
}
