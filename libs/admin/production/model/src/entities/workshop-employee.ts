/** A worker of «Швейний цех». Workers do not sign in; the head of the workshop keeps this list. */
export interface WorkshopEmployee {
  id: number;
  fullName: string;
  position: string;
  /** false = archived: left the workshop, kept for old work and pay. */
  isActive: boolean;
  updatedAt: string;
}

export interface WorkshopEmployeeDraft {
  fullName: string;
  position: string;
}

export const WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH = 120;
export const WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH = 80;

/** Suggestions for the position field; any other text is allowed. */
export const workshopPositions = ['Швачка', 'Закрійник', 'Майстер цеху', 'Начальник цеху'] as const;
