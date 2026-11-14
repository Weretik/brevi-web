/** Tabs of «Персонал цеху» the signed-in person may open; each is its own page of «Права доступу». */
export interface WorkshopPeopleAccess {
  staff: boolean;
  timesheet: boolean;
  payroll: boolean;
}
