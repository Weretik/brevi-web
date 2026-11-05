import { useState } from 'react';

import type { KeyboardEvent, MouseEvent } from 'react';

interface IdentifiableRow {
  id: number | string;
}

interface RowMenuState<Row> {
  row: Row;
  anchorPosition: { left: number; top: number };
  focusTarget: HTMLElement | null;
}

export function useReferenceRowContextMenu<Row extends IdentifiableRow>(rows: Row[]) {
  const [rowMenu, setRowMenu] = useState<RowMenuState<Row> | null>(null);

  function findRow(element: HTMLDivElement) {
    const rowId = element.dataset['id'];
    return rows.find((row) => String(row.id) === rowId);
  }

  function openRowMenuForElement(
    element: HTMLDivElement,
    anchorPosition: RowMenuState<Row>['anchorPosition'],
    focusTarget: HTMLElement | null,
  ) {
    const row = findRow(element);
    if (row) setRowMenu({ row, anchorPosition, focusTarget });
  }

  function handleRowContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    openRowMenuForElement(
      event.currentTarget,
      { left: event.clientX + 2, top: event.clientY - 6 },
      document.activeElement instanceof HTMLElement ? document.activeElement : null,
    );
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
    event.preventDefault();
    const focusTarget = event.target instanceof HTMLElement ? event.target : event.currentTarget;
    const bounds = event.currentTarget.getBoundingClientRect();
    openRowMenuForElement(
      event.currentTarget,
      { left: bounds.left + 24, top: bounds.top + bounds.height / 2 },
      focusTarget,
    );
  }

  function closeRowMenu(restoreFocus = true) {
    const focusTarget = rowMenu?.focusTarget;
    setRowMenu(null);
    if (restoreFocus) requestAnimationFrame(() => focusTarget?.focus());
  }

  return {
    rowMenu,
    closeRowMenu,
    openRowMenu: (
      row: Row,
      anchorPosition: RowMenuState<Row>['anchorPosition'],
      focusTarget: HTMLElement,
    ) => setRowMenu({ row, anchorPosition, focusTarget }),
    rowSlotProps: {
      onContextMenu: handleRowContextMenu,
      onKeyDown: handleRowKeyDown,
    },
  };
}
