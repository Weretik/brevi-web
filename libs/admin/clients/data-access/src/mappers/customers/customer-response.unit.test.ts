import { describe, expect, it } from 'vitest';

import { mapCustomerDetail } from './customer-detail.mapper';
import { mapCustomerKeepinSyncResult } from './customer-keepin-sync.mapper';
import { mapCustomerPage } from './customer-page.mapper';

const summary = {
  publicId: '11111111-1111-4111-8111-111111111111',
  kind: 'person',
  displayName: 'Synthetic',
  legalName: null,
  taxIdentity: null,
  ownerId: 17,
  active: true,
  revision: 2,
  updatedAt: '2026-10-26T12:00:00Z',
};
describe('CRM response boundary', () => {
  it('maps the KeepinCRM list fields and defaults them when the response leaves them out', () => {
    const page = mapCustomerPage({
      value: [
        { ...summary, keepinCrmId: '10', contactName: 'Олена', phones: ['+380671234567'] },
        summary,
      ],
      pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 1, totalRecords: 2 },
    });
    expect(page.rows[0]).toMatchObject({
      keepinCrmId: '10',
      contactName: 'Олена',
      phones: ['+380671234567'],
    });
    expect(page.rows[1]).toMatchObject({ keepinCrmId: null, contactName: null, phones: [] });
  });
  it('maps the KeepinCRM sync result', () => {
    expect(
      mapCustomerKeepinSyncResult({
        applied: true,
        received: 2,
        created: 1,
        updated: 0,
        unchanged: 1,
        deactivated: [],
        deleted: [],
        hiddenInUse: [],
      }),
    ).toMatchObject({ applied: true, received: 2, created: 1, unchanged: 1 });
    expect(() => mapCustomerKeepinSyncResult({ applied: true })).toThrow();
  });
  it('preserves server paging totals instead of treating an empty page as empty database', () => {
    const result = mapCustomerPage({
      value: [],
      pagedInfo: { pageNumber: 3, pageSize: 25, totalPages: 4, totalRecords: 76 },
    });
    expect(result).toEqual({ rows: [], page: 3, pageSize: 25, totalPages: 4, total: 76 });
    expect(() => mapCustomerPage({ value: [] })).toThrow();
  });
  it('maps contacts/source IDs/capabilities and rejects forged wire types', () => {
    const detail = {
      ...summary,
      canEdit: true,
      canMerge: false,
      externalIdentities: [{ source: 'fixture', type: 'client', externalId: '17' }],
      contacts: [
        {
          publicId: '22222222-2222-4222-8222-222222222222',
          name: 'Synthetic contact',
          position: null,
          active: true,
          isPrimary: true,
          channels: [{ kind: 'phone', value: '+44 (20) 1234-5678' }],
        },
      ],
    };
    const mapped = mapCustomerDetail(detail);
    expect(mapped.canMerge).toBe(false);
    expect(mapped.contacts[0]?.channels[0]?.value).toBe('+44 (20) 1234-5678');
    expect(() => mapCustomerDetail({ ...detail, canMerge: 'true' })).toThrow();
    expect(() => mapCustomerDetail({ ...detail, revision: 0 })).toThrow();
  });
  it('rejects unsupported channel kinds before the UI receives the record', () => {
    expect(() =>
      mapCustomerDetail({
        ...summary,
        canEdit: true,
        canMerge: false,
        externalIdentities: [],
        contacts: [
          {
            publicId: '22222222-2222-4222-8222-222222222222',
            name: 'Synthetic',
            position: null,
            active: true,
            isPrimary: false,
            channels: [{ kind: 'script', value: 'invalid' }],
          },
        ],
      }),
    ).toThrow();
  });
});
