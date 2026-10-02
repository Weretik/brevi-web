import { useState } from 'react';

import type { KeyboardEvent, MouseEvent } from 'react';

interface IdentifiableRow {
  id: number;
}

interface RowMenuState<Row> {
  row: Row;
  anchorPosition: { left: number; top: number };
  focusTarget: HTMLElement | null;
}

export function useReferenceRowContextMenu<Row extends IdentifiableRow>(rows: Row[]) {
  const [rowMenu, setRowMenu] = useState<RowMenuState<Row> | null>(null);

  function findRow(element: HTMLDivElement) {
    const rowId = Number(element.dataset['id']);
    return rows.find((row) => row.id === rowId);
  }

  function openRowMenu(
    element: HTMLDivElement,
    anchorPosition: RowMenuState<Row>['anchorPosition'],
    focusTarget: HTMLElement | null,
  ) {
    const row = findRow(element);
    if (row) setRowMenu({ row, anchorPosition, focusTarget });
  }

  function handleRowContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    openRowMenu(
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
    openRowMenu(
      event.currentTarget,
      { left: bounds.left + 24, top: bounds.top + bounds.height / 2 },
      focusTarget,
    );
  }

  function closeRowMenu() {
    const focusTarget = rowMenu?.focusTarget;
    setRowMenu(null);
    requestAnimationFrame(() => focusTarget?.focus());
  }

  return {
    rowMenu,
    closeRowMenu,
    rowSlotProps: {
      onContextMenu: handleRowContextMenu,
      onKeyDown: handleRowKeyDown,
    },
  };
}
