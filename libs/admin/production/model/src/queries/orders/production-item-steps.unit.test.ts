import { describe, expect, it } from 'vitest';

import { itemStageSteps, nextItemStage } from './production-item-steps';

import type { ItemApplication } from '../../entities/orders/production-order';
import type { ProductionStage } from '../../entities/orders/production-tracking';

const item = (stages: ProductionStage[], withApplication = false) => ({
  stages,
  currentStage: stages[stages.length - 1] ?? ('New' as ProductionStage),
  applications: withApplication ? [{ kind: 'Print' } as ItemApplication] : [],
});

describe('item stage steps', () => {
  it('skips «Нанесення» for an item without applications', () => {
    expect(itemStageSteps(item(['New']))).not.toContain('Application');
    expect(itemStageSteps(item(['New'], true))).toContain('Application');
    expect(itemStageSteps(item(['Application']))).toContain('Application');
    expect(itemStageSteps(item(['New']))).not.toContain('New');
  });

  it('gives the step after the furthest ticked one', () => {
    expect(nextItemStage(item(['New']))).toBe('FabricOrdered');
    expect(nextItemStage(item(['FabricAvailable', 'Cutting']))).toBe('Sewing');
    expect(nextItemStage(item(['Cutting'], true))).toBe('Application');
    expect(nextItemStage(item(['Complete']))).toBeNull();
  });
});
