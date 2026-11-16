import {
  activityActionLabel,
  activityRoleLabel,
  activityRoles,
  allActivityRoles,
} from '@admin/activity-log/model';
import { ReferenceFilterRow } from '@admin/references/ui';
import { Divider, TextField } from '@mui/material';

import { ActivityChoiceFilter } from './activity-choice-filter';

import type { ActivityFilterOptions, ActivityQuery } from '@admin/activity-log/model';

interface Props {
  query: ActivityQuery;
  options: ActivityFilterOptions;
  onChange: (change: Partial<ActivityQuery>) => void;
}

const roleChoices = activityRoles.map((role) => ({ value: role, label: activityRoleLabel(role) }));
const dateField = { width: 158, '& input': { fontFamily: 'var(--admin-font-mono)' } };

/** R-02: «Хто», «Роль» (managers by default), «Об'єкт», «Дія» and the period «з» – «по». */
export function ActivityFilterRow({ query, options, onChange }: Props) {
  return (
    <ReferenceFilterRow
      countLabel="Кількість записів"
      count={0}
      total={0}
      selectedCount={0}
      onClearSelection={() => undefined}
      filters={
        <>
          <ActivityChoiceFilter
            label="Хто"
            allLabel="Усі люди"
            options={options.actors.map((actor) => ({
              value: String(actor.id),
              label: actor.name,
            }))}
            value={query.actorId === undefined ? undefined : String(query.actorId)}
            onChange={(value) =>
              onChange({ actorId: value === undefined ? undefined : Number(value) })
            }
          />
          <ActivityChoiceFilter
            label="Роль"
            allLabel="Усі ролі"
            options={roleChoices}
            value={query.role}
            onChange={(value) => onChange({ role: value ?? allActivityRoles })}
          />
          <ActivityChoiceFilter
            label="Об'єкт"
            allLabel="Усі об'єкти"
            options={options.subjectTypes.map((type) => ({ value: type.key, label: type.title }))}
            value={query.subjectType}
            onChange={(value) => onChange({ subjectType: value })}
          />
          <ActivityChoiceFilter
            label="Дія"
            allLabel="Усі дії"
            options={options.actions.map((action) => ({
              value: action,
              label: activityActionLabel(action),
            }))}
            value={query.action}
            onChange={(value) => onChange({ action: value })}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <TextField
            type="date"
            size="small"
            label="З"
            value={query.from ?? ''}
            onChange={(event) => onChange({ from: event.target.value || undefined })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: query.to } }}
            sx={dateField}
          />
          <TextField
            type="date"
            size="small"
            label="По"
            value={query.to ?? ''}
            onChange={(event) => onChange({ to: event.target.value || undefined })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: query.from } }}
            sx={dateField}
          />
        </>
      }
    />
  );
}
