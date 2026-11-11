import {
  useSaveSiteGalleryMutation,
  useTransferSiteGalleryMutation,
} from '@admin/content/data-access';
import { siteGalleryInputOf } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SiteGallery, SiteGalleryItem, SiteGalleryKind } from '@admin/content/model';

export interface TransferReport {
  moved: number;
  left: number;
  problems: string[];
}

/**
 * Saving the whole list of «Наші роботи» or «Сертифікати» after each change, and «Перенести у бібліотеку фото»,
 * repeated step by step while pictures move.
 */
export function useSiteGalleryActions(kind: SiteGalleryKind) {
  const [save, saving] = useSaveSiteGalleryMutation();
  const [transferStep] = useTransferSiteGalleryMutation();
  const [transferring, setTransferring] = useState(false);
  const [report, setReport] = useState<TransferReport | null>(null);

  /** Saves the list; returns the reason when the save is refused. */
  async function saveItems(gallery: SiteGallery, items: SiteGalleryItem[]): Promise<string | null> {
    try {
      await save(siteGalleryInputOf(gallery, items)).unwrap();
      return null;
    } catch (error) {
      return adminApiErrorMessage(error, 'Не вдалося зберегти зміни.');
    }
  }

  async function transfer() {
    setTransferring(true);
    const total: TransferReport = { moved: 0, left: 0, problems: [] };
    setReport({ ...total });
    try {
      for (;;) {
        const step = await transferStep(kind).unwrap();
        total.moved += step.moved;
        total.left = step.left;
        total.problems = [...total.problems, ...step.problems];
        setReport({ ...total });
        if (step.moved === 0 || step.left === 0) break;
      }
    } catch (error) {
      total.problems = [
        ...total.problems,
        adminApiErrorMessage(error, 'Перенесення перервалося. Натисніть кнопку ще раз.'),
      ];
      setReport({ ...total });
    } finally {
      setTransferring(false);
    }
  }

  return {
    saving: saving.isLoading,
    saveItems,
    transferring,
    report,
    clearReport: () => setReport(null),
    transfer,
  };
}
