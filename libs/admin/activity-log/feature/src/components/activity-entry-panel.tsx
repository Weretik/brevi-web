import {
  activityActionLabel,
  activityRoleLabel,
  activitySubjectPath,
  formatActivityTime,
} from '@admin/activity-log/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { ActivityChanges } from './activity-changes';

import type { ActivityEntry } from '@admin/activity-log/model';
import type { ReactNode } from 'react';

interface Props {
  entry: ActivityEntry;
  onClose: () => void;
}

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

/** R-03: one entry in full, read only; the object links to its page unless it was deleted. */
export function ActivityEntryPanel({ entry, onClose }: Props) {
  const path = activitySubjectPath(entry);
  const subject = `${entry.subjectTypeTitle} ${entry.subjectTitle}`;
  return (
    <ReferenceEditorDrawer
      titleId="activity-entry-title"
      title={activityActionLabel(entry.action)}
      description={subject}
      formId="activity-entry"
      paperWidth={480}
      readOnly
      saving={false}
      editLabel={null}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        <Line label="Коли">
          <Typography variant="body2" className="reference-mono">
            {formatActivityTime(entry.occurredAt)}
          </Typography>
        </Line>
        <Line label="Хто">
          <Typography variant="body2">
            {entry.actorName}
            {entry.actorRoles.length > 0 &&
              ` · ${entry.actorRoles.map(activityRoleLabel).join(', ')}`}
          </Typography>
        </Line>
        <Line label="Об'єкт">
          {path ? (
            <Link component={RouterLink} to={path} variant="body2" color="primary.dark">
              {subject}
            </Link>
          ) : (
            <Typography variant="body2">{subject}</Typography>
          )}
        </Line>
        {entry.summary && (
          <Line label="Опис">
            <Typography variant="body2">{entry.summary}</Typography>
          </Line>
        )}
        {entry.changes.length > 0 && (
          <Line label="Зміни">
            <ActivityChanges changes={entry.changes} />
          </Line>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
