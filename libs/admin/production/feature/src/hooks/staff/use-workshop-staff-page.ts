import { useImportWorkshopStaffMutation } from '@admin/production/data-access';
import { filterWorkshopStaff } from '@admin/production/model';
import { useMemo, useState } from 'react';

import { useWorkshopEmployeeActivation } from './use-workshop-employee-activation';
import { useWorkshopStaff } from './use-workshop-staff';

import type { ProductionEditorMode } from './use-workshop-employee-editor';
import type { WorkshopEmployee, WorkshopStaffStatus } from '@admin/production/model';

/** «Працівники»: the staff with the search, status and position chips, the side panel, import and activation. */
export function useWorkshopStaffPage() {
  const { rows, loading, error, reload } = useWorkshopStaff();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<WorkshopStaffStatus>('active');
  const [position, setPosition] = useState<string | null>(null);
  const [active, setActive] = useState<{
    mode: ProductionEditorMode;
    employee: WorkshopEmployee | null;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const activation = useWorkshopEmployeeActivation(setMessage);
  const [importStaff] = useImportWorkshopStaffMutation();
  const filtered = useMemo(
    () => filterWorkshopStaff(rows, search, status, position),
    [rows, search, status, position],
  );
  const inStatus = rows.filter((row) => row.isActive === (status === 'active')).length;
  const activeCount = rows.filter((row) => row.isActive).length;
  return {
    rows,
    loading,
    error,
    reload,
    search,
    setSearch,
    status,
    setStatus,
    position,
    setPosition,
    active,
    setActive,
    importing,
    setImporting,
    message,
    setMessage,
    activation,
    importStaff,
    filtered,
    inStatus,
    activeCount,
  };
}
