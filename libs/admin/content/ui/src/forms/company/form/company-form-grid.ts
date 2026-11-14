/** Two columns from `sm`, one below. */
export const companyFormGrid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
} as const;
