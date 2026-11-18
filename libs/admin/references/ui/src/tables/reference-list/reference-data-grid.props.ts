import type { PageAction } from '@admin/shared/ui';
import type {
  GridColDef,
  GridColumnGroupingModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';

export interface ReferenceRow extends GridValidRowModel {
  /** Numeric ids in references; text ids (uuid) in other modules. */
  id: number | string;
  name: string;
}

/** Inputs of the «Цех» reference table. */
export interface ReferenceDataGridProps<Row extends ReferenceRow> {
  ariaLabel: string;
  rows: Row[];
  /** Data columns; the row actions column is added at the end. */
  columns: GridColDef<Row>[];
  loading: boolean;
  /** True when the full list has rows, so an empty result means nothing matched. */
  searching?: boolean;
  unavailable?: boolean;
  emptyLabel: string;
  notFoundLabel: string;
  menuLabel: string;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (row: Row) => void;
  onEdit: (row: Row) => void;
  onDelete: (id: Row['id']) => void;
  /** Rows that are details of another row (no checkbox, no menu). */
  isDetailRow?: (row: Row) => boolean;
  /** Column sorting; off when the row order carries meaning (detail rows follow their parent). */
  sortable?: boolean;
  /** Label of the menu's view action. */
  viewLabel?: string;
  /** A full page of the row: a «Відкрити повну картку» button next to «…» and in the menu. */
  openHref?: (row: Row) => string;
  /** Label of the menu's delete action; «Видалити» by default. */
  deleteLabel?: string;
  /** The «Права доступу» action of the last menu item: delete by default, edit when it archives or voids. */
  deleteRight?: PageAction;
  /** Checkbox column and selected count; off for lists without bulk actions. */
  selectable?: boolean;
  /**
   * Paging and sorting on the server: `rows` is the current page (with its detail rows) and
   * `rowCount` the number of matching rows.
   */
  server?: {
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
  };
  /** Header groups over data columns, for example «2 кольори» over «Основна», «Додаткова», «Разом». */
  columnGroupingModel?: GridColumnGroupingModel;
  /** Taller rows for a two-line cell; 52 by default. */
  rowHeight?: number;
}
