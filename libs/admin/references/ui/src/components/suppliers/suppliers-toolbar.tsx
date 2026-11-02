import { ReferenceListToolbar } from '../reference-list/reference-list-toolbar';

import type { ComponentProps } from 'react';

type Props = Omit<
  ComponentProps<typeof ReferenceListToolbar>,
  'searchPlaceholder' | 'searchLabel' | 'countLabel' | 'activityLabels'
>;

export function SuppliersToolbar(props: Props) {
  return (
    <ReferenceListToolbar
      searchPlaceholder="Назва, контакт, телефон, email"
      searchLabel="Пошук постачальників"
      countLabel="Кількість постачальників"
      activityLabels={{ active: 'Активні', inactive: 'Не використовуються', all: 'Усі' }}
      {...props}
    />
  );
}
