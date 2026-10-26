import {
  useGetSewingAccessQuery,
  useGetSewingCompositionQuery,
  useListSewingArticlesQuery,
} from '@admin/products/data-access';
import {
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
} from '@admin/references/data-access';

export function useSewingCompositionQueries(
  productId: number,
  scope: 'Model' | 'Article',
  selectedArticleId: number | null,
) {
  const access = useGetSewingAccessQuery();
  const canRead = access.data?.canRead === true;
  const fabrics = useListFabricsQuery(undefined, { skip: !canRead });
  const accessories = useListGarmentAccessoriesQuery(undefined, { skip: !canRead });
  const operations = useListGarmentPartOperationsQuery(undefined, { skip: !canRead });
  const articles = useListSewingArticlesQuery(productId, { skip: !canRead });
  const sharedComposition = useGetSewingCompositionQuery(
    { productId, articleId: null },
    { skip: !canRead },
  );
  const selectedComposition = useGetSewingCompositionQuery(
    { productId, articleId: selectedArticleId },
    { skip: !canRead || scope !== 'Article' || selectedArticleId === null },
  );

  return {
    access,
    canRead,
    fabrics,
    accessories,
    operations,
    articles,
    sharedComposition,
    selectedComposition,
  };
}
