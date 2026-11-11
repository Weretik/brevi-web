export const articlesTag = { type: 'ContentArticle' as const, id: 'LIST' };
export const articleTag = (id: number) => ({ type: 'ContentArticle' as const, id });
