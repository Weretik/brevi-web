import {
  useGetSewingAccessQuery,
  useGetSewingCompositionQuery,
  useListSewingArticlesQuery,
} from '@admin/products/data-access';

export function useLegacySewingNormLock(productId: number, isSewingProduct: boolean) {
  const access = useGetSewingAccessQuery(undefined, { skip: !isSewingProduct });
  const canRead = isSewingProduct && access.data?.canRead === true;
  const articles = useListSewingArticlesQuery(productId, { skip: !canRead });
  const composition = useGetSewingCompositionQuery(
    { productId, articleId: null },
    { skip: !canRead },
  );
  const known =
    !isSewingProduct ||
    Boolean(
      canRead &&
      articles.data &&
      composition.data &&
      !articles.isFetching &&
      !composition.isFetching,
    );
  const hasData = Boolean(
    (articles.data?.articles.length ?? 0) > 0 ||
    (composition.data?.materials.length ?? 0) > 0 ||
    (composition.data?.operations.length ?? 0) > 0,
  );
  const locked = Boolean(isSewingProduct && (!known || hasData));
  const loading = Boolean(
    isSewingProduct &&
    (access.isLoading ||
      (canRead &&
        (articles.isLoading ||
          composition.isLoading ||
          articles.isFetching ||
          composition.isFetching))),
  );
  const error = isSewingProduct ? (access.error ?? articles.error ?? composition.error) : undefined;
  const message = hasData
    ? 'Для цього товару вже налаштовано нові артикули або склад. Старі норми заблоковано, щоб зміни не перезаписали новий склад.'
    : !known
      ? access.data?.canRead === false
        ? 'Не вдалося перевірити артикули та склад. Старі норми заблоковано до перевірки.'
        : loading
          ? 'Перевіряємо артикули та спільний склад…'
          : 'Не вдалося перевірити артикули та склад. Старі норми залишаються заблокованими.'
      : undefined;

  async function retry() {
    if (access.isError || !access.data) {
      await access.refetch();
      return;
    }
    if (!canRead) return;
    if (articles.isError || !articles.data) await articles.refetch();
    if (composition.isError || !composition.data) await composition.refetch();
  }

  return { locked, loading, message, error, retry };
}
