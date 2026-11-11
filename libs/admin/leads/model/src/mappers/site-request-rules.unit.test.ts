import { describe, expect, it } from 'vitest';

import {
  formatSiteRequestPhone,
  siteRequestActions,
  siteRequestPhoneHref,
} from './site-request-rules';

import type { SiteRequest, SiteRequestViewer } from '../entities/site-request';

const request = (patch: Partial<SiteRequest> = {}): SiteRequest => ({
  id: 1,
  phone: '0504698675',
  workwear: null,
  quantity: null,
  comment: null,
  locale: 'uk',
  fileName: null,
  fileUrl: null,
  status: 'New',
  ownerUserId: null,
  ownerName: null,
  takenAt: null,
  closedAt: null,
  note: null,
  createdAt: '2026-11-11T10:00:00Z',
  notifyError: null,
  version: 1,
  ...patch,
});

const manager: SiteRequestViewer = { userId: 7, isAdmin: false, canEdit: true };

describe('siteRequestActions', () => {
  it('lets anyone with edit take or close a free request', () => {
    expect(siteRequestActions(request(), manager)).toEqual(['Take', 'Done', 'Spam']);
  });

  it('lets only the owner or an admin manage a taken request', () => {
    const taken = request({ status: 'InWork', ownerUserId: 3, ownerName: 'Олена' });
    expect(siteRequestActions(taken, manager)).toEqual([]);
    expect(siteRequestActions(taken, { ...manager, userId: 3 })).toEqual([
      'Done',
      'Spam',
      'Reopen',
    ]);
    expect(siteRequestActions(taken, { ...manager, isAdmin: true })).toEqual([
      'Done',
      'Spam',
      'Reopen',
    ]);
  });

  it('offers only «Повернути в нові» on a closed request and nothing without edit', () => {
    const closed = request({ status: 'Done', ownerUserId: 7 });
    expect(siteRequestActions(closed, manager)).toEqual(['Reopen']);
    expect(siteRequestActions(request(), { ...manager, canEdit: false })).toEqual([]);
  });
});

describe('site request phone', () => {
  it('formats local and international numbers', () => {
    expect(formatSiteRequestPhone('0504698675')).toBe('050 469 86 75');
    expect(formatSiteRequestPhone('+38 (050) 469-86-75')).toBe('050 469 86 75');
    expect(formatSiteRequestPhone('12345')).toBe('12345');
  });

  it('dials in the international form', () => {
    expect(siteRequestPhoneHref('050 469 86 75')).toBe('tel:+380504698675');
    expect(siteRequestPhoneHref('380504698675')).toBe('tel:+380504698675');
  });
});
