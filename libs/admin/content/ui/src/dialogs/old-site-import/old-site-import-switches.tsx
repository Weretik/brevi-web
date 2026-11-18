import { FormControlLabel, Stack, Switch } from '@mui/material';

import type { OldSiteImportCopy } from './old-site-import-copy';
import type { OldSiteImportOptions } from '@admin/content/model';

/** «Показувати на сайті» (when the transfer has it) and «Замінити» before the transfer runs. */
export function OldSiteImportSwitches({
  copy,
  options,
  busy,
  onOptions,
}: {
  copy: OldSiteImportCopy;
  options: OldSiteImportOptions;
  busy: boolean;
  onOptions: (options: OldSiteImportOptions) => void;
}) {
  return (
    <Stack>
      {copy.showOnSite && (
        <FormControlLabel
          control={
            <Switch
              checked={options.showOnSite}
              disabled={busy}
              onChange={(_event, showOnSite) => onOptions({ ...options, showOnSite })}
            />
          }
          label={copy.showOnSite}
        />
      )}
      <FormControlLabel
        control={
          <Switch
            checked={options.overwrite}
            disabled={busy}
            onChange={(_event, overwrite) => onOptions({ ...options, overwrite })}
          />
        }
        label={copy.overwrite}
      />
    </Stack>
  );
}
