import { accessCellOf } from '@admin/users/model';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';

import type { AccessAreaGroup, AccessRole } from '@admin/users/model';

interface AccessCompareTableProps {
  roles: readonly AccessRole[];
  /** Groups with the pages left after search. */
  groups: readonly AccessAreaGroup[];
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** «Порівняти ролі»: every page against every saved role, read only. */
export function AccessCompareTable({ groups, roles }: AccessCompareTableProps) {
  return (
    <Card variant="outlined">
      <Typography sx={{ color: 'text.secondary', px: 2, py: 1 }} variant="body2">
        П — бачить, С — створює, Р — редагує, В — видаляє. Показано збережені права.
      </Typography>
      <TableContainer sx={{ maxHeight: 'var(--admin-table-height)' }}>
        <Table aria-label="Порівняння ролей" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Сторінка</TableCell>
              {roles.map((role) => (
                <TableCell key={role.name} sx={{ whiteSpace: 'nowrap' }}>
                  {role.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <Fragment key={group.title}>
                <TableRow>
                  <TableCell
                    colSpan={roles.length + 1}
                    sx={{ bgcolor: 'action.hover', fontWeight: 600 }}
                  >
                    {group.title}
                  </TableCell>
                </TableRow>
                {group.areas.map((area) => (
                  <TableRow hover key={area.key}>
                    <TableCell component="th" scope="row">
                      {area.title}
                    </TableCell>
                    {roles.map((role) => {
                      const cell = accessCellOf(role, area);
                      return (
                        <TableCell
                          key={role.name}
                          sx={{
                            ...mono,
                            color: cell === '—' ? 'text.disabled' : 'text.primary',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
