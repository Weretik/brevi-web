export const siteCategoriesTag = { type: 'SiteCategory' as const, id: 'LIST' };
export const siteCategoryTag = (id: number) => ({ type: 'SiteCategory' as const, id });
