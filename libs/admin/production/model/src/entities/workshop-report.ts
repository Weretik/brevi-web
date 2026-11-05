/** «Звіти цеху» (PRD-D48): at most 12 whole months per period. */
export const WORKSHOP_REPORT_MAX_MONTHS = 12;

/** Money counts only what has a price; unpriced pieces and metres are given apart. */
export interface WorkshopReportTotals {
  sewnPieces: number;
  outputValue: number;
  unpricedPieces: number;
  accrued: number;
  minutes: number;
  issuedMeters: number;
  issuedValue: number;
  unpricedIssuedMeters: number;
  stockMeters: number;
  stockValue: number;
  unpricedStockMeters: number;
}

export interface ReportOutputRow {
  orderId: number;
  orderNumber: number;
  clientName: string;
  itemId: number;
  modelName: string;
  quantity: number;
  unitPrice: number | null;
  value: number | null;
}

/** `dayAverage` is the pay per 8 hours of «Робочий час», null without hours. */
export interface ReportStaffRow {
  employeeId: number;
  name: string;
  position: string;
  minutes: number;
  sewn: number;
  cut: number;
  accrued: number;
  dayAverage: number | null;
}

export interface ReportIssueRow {
  movementId: number;
  issuedOn: string;
  fabricCode: string;
  fabricName: string;
  color: string;
  orderId: number | null;
  orderNumber: number | null;
  modelName: string | null;
  meters: number;
  pricePerMeter: number | null;
  value: number | null;
}

export interface ReportStockRow {
  stockId: number;
  fabricCode: string;
  fabricName: string;
  color: string;
  meters: number;
  pricePerMeter: number | null;
  value: number | null;
}

/** Months closed in «Зарплата» are kept; the open ones are counted from the current data. */
export interface WorkshopReport {
  from: string;
  to: string;
  closedMonths: string[];
  openMonths: string[];
  totals: WorkshopReportTotals;
  output: ReportOutputRow[];
  staff: ReportStaffRow[];
  materials: ReportIssueRow[];
  stock: ReportStockRow[];
  warnings: string[];
}

export interface WorkshopReportPair {
  current: WorkshopReport;
  comparison: WorkshopReport | null;
}

export interface WorkshopReportQuery {
  from: string;
  to: string;
  compareFrom?: string;
  compareTo?: string;
}

/** «Огляд виробництва»: the «Нове» orders by the stage of their slowest item; no prices or rates. */
export interface WorkshopDashboardOrder {
  id: number;
  number: number;
  clientName: string;
  product: string;
  items: number;
  quantity: number;
  /** Share of pieces sewn within the plan, 0–100. */
  progress: number;
  dueDate: string;
  isLate: boolean;
}

export interface WorkshopDashboardStage {
  stage: number;
  label: string;
  orders: WorkshopDashboardOrder[];
}

export interface WorkshopDashboardHours {
  employeeId: number;
  name: string;
  minutes: number;
}

export interface WorkshopDashboard {
  today: string;
  openOrders: number;
  openPieces: number;
  lateOrders: number;
  readyOrders: number;
  readyPieces: number;
  stages: WorkshopDashboardStage[];
  /** This week by active worker; null for those who do not keep «Робочий час». */
  hours: WorkshopDashboardHours[] | null;
}
