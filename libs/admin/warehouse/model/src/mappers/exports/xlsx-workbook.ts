import { storedZip } from './stored-zip';

/** A cell: text is always written as text, never as a formula; numbers stay numbers. */
export type XlsxCell = string | number | null;

export interface XlsxSheet {
  name: string;
  /** Lines above the table, such as the export time and totals. */
  info: XlsxCell[][];
  header: string[];
  rows: XlsxCell[][];
  /** Column widths in characters. */
  widths: number[];
}

export const encoder = new TextEncoder();

// Characters XML 1.0 does not allow.

const invalidXml = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

const xml = (value: string) =>
  value
    .replace(invalidXml, '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const column = (index: number) => {
  let name = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26))
    name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
};

/** Inline strings cannot be formulas, so «=1+1» or «@user» stays text in Excel. */
function cell(value: XlsxCell, ref: string, style: number) {
  const s = style ? ` s="${style}"` : '';
  if (value === null || value === '') return '';
  if (typeof value === 'number')
    return Number.isFinite(value) ? `<c r="${ref}"${s}><v>${value}</v></c>` : '';
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
}

function sheetXml(sheet: XlsxSheet) {
  const headerRow = sheet.info.length + 1;
  const lastRow = headerRow + sheet.rows.length;
  const lastColumn = column(Math.max(sheet.header.length, 1) - 1);
  const line = (cells: XlsxCell[], row: number, style: (index: number) => number) =>
    `<row r="${row}">${cells.map((value, index) => cell(value, `${column(index)}${row}`, style(index))).join('')}</row>`;
  const rows = [
    ...sheet.info.map((cells, index) => line(cells, index + 1, () => 0)),
    line(sheet.header, headerRow, () => 1),
    ...sheet.rows.map((cells, index) =>
      line(cells, headerRow + index + 1, (i) => (typeof cells[i] === 'number' ? 2 : 0)),
    ),
  ];
  const cols = sheet.widths
    .map(
      (width, index) =>
        `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
    )
    .join('');
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerRow}" topLeftCell="A${headerRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    (cols ? `<cols>${cols}</cols>` : '') +
    `<sheetData>${rows.join('')}</sheetData>` +
    `<autoFilter ref="A${headerRow}:${lastColumn}${lastRow}"/>` +
    '</worksheet>'
  );
}

const sheetName = (name: string) => name.replace(/[[\]:*?/\\']/g, ' ').slice(0, 31) || 'Аркуш';

function workbookParts(sheets: readonly XlsxSheet[]): [string, string][] {
  const names = sheets.map((sheet) => sheetName(sheet.name));
  const filters = sheets.map((sheet, index) => {
    const headerRow = sheet.info.length + 1;
    const lastColumn = column(Math.max(sheet.header.length, 1) - 1);
    return `<definedName name="_xlnm._FilterDatabase" localSheetId="${index}" hidden="1">'${xml(names[index] ?? '')}'!$A$${headerRow}:$${lastColumn}$${headerRow + sheet.rows.length}</definedName>`;
  });
  return [
    [
      '[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        sheets
          .map(
            (_, index) =>
              `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
          )
          .join('') +
        '</Types>',
    ],
    [
      '_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>',
    ],
    [
      'xl/workbook.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        `<sheets>${names.map((name, index) => `<sheet name="${xml(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')}</sheets>` +
        `<definedNames>${filters.join('')}</definedNames>` +
        '</workbook>',
    ],
    [
      'xl/_rels/workbook.xml.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets
          .map(
            (_, index) =>
              `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
          )
          .join('') +
        `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
        '</Relationships>',
    ],
    [
      'xl/styles.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.00"/></numFmts>' +
        '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
        '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
        '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
        '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>' +
        '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
        '</styleSheet>',
    ],
    ...sheets.map(
      (sheet, index) =>
        [`xl/worksheets/sheet${index + 1}.xml`, sheetXml(sheet)] as [string, string],
    ),
  ];
}

/** An .xlsx workbook: a frozen header row with a filter on every sheet. */
export function xlsxWorkbook(sheets: readonly XlsxSheet[]): Uint8Array {
  return storedZip(workbookParts(sheets).map(([path, text]) => [path, encoder.encode(text)]));
}

export const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
