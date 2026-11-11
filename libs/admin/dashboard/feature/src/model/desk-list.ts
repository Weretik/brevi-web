/** A line of a desk block: a name, maybe a link, and either a problem mark or a plain value. */
export interface DeskListRow {
  key: string;
  name: string;
  /** Link of the name, e.g. the order or the КП. */
  href?: string;
  /** A problem with its reason; a block never marks what is fine. */
  mark?: { text: string; tone: 'error' | 'warning' };
  /** A quiet value on the right: a quantity, a time, a date. */
  value?: string;
}

/** A block keeps at most this many lines; the rest are on the section page. */
export const deskListSize = 5;

export interface DeskList {
  rows: DeskListRow[];
  /** Lines left out of the block. */
  more: number;
}

export const toDeskList = (rows: readonly DeskListRow[]): DeskList => ({
  rows: rows.slice(0, deskListSize),
  more: Math.max(0, rows.length - deskListSize),
});
