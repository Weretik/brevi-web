import type { SiteCompanyErrors, SiteCompanyFormValues } from '@admin/content/model';

/** What every part of the company form gets: the values, their errors and a setter of one field. */
export interface CompanyFormSectionProps {
  values: SiteCompanyFormValues;
  errors: SiteCompanyErrors;
  disabled: boolean;
  set: <K extends keyof SiteCompanyFormValues>(key: K, value: SiteCompanyFormValues[K]) => void;
}
