/** «Заявки з сайту» (LEAD-002): a request a visitor sent from the site form «Заявка». */
export type SiteRequestStatus = 'New' | 'InWork' | 'Done' | 'Spam';

export type SiteRequestScope = 'Open' | 'Mine' | 'Closed' | 'All';

/** «Беру», «Готово», «Не заявка», «Повернути в нові». */
export type SiteRequestAction = 'Take' | 'Done' | 'Spam' | 'Reopen';

export interface SiteRequest {
  readonly id: number;
  readonly phone: string;
  readonly workwear: string | null;
  readonly quantity: string | null;
  readonly comment: string | null;
  readonly locale: 'uk' | 'ru';
  readonly fileName: string | null;
  readonly fileUrl: string | null;
  readonly status: SiteRequestStatus;
  readonly ownerUserId: number | null;
  readonly ownerName: string | null;
  readonly takenAt: string | null;
  readonly closedAt: string | null;
  readonly note: string | null;
  readonly createdAt: string;
  /** Why the bot could not post the request to Telegram; null when it did. */
  readonly notifyError: string | null;
  readonly version: number;
}

export interface SiteRequestCounts {
  readonly new: number;
  readonly inWork: number;
  readonly mine: number;
  readonly closed: number;
}

export interface SiteRequestPage {
  readonly items: readonly SiteRequest[];
  readonly total: number;
  readonly counts: SiteRequestCounts;
}

export interface SiteRequestListQuery {
  readonly scope: SiteRequestScope;
  readonly page: number;
  readonly pageSize: number;
}

/** The signed-in person on «Заявки з сайту». */
export interface SiteRequestViewer {
  readonly userId: number | null;
  readonly isAdmin: boolean;
  readonly canEdit: boolean;
}
