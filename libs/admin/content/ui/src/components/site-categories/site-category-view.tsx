import { siteCategoryName, siteCategoryProblems } from '@admin/content/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../product-pages/content-language-tabs';
import { ContentBlocksPreview, ContentPreviewPart } from '../product-pages/content-text-preview';

import type { ContentLanguage, SiteCategory, SiteCategoryRow } from '@admin/content/model';

interface Props {
  category: SiteCategory;
  /** The category this one sits under; null on the top level. */
  parent: SiteCategoryRow | null;
}

/** Read-only side of the panel: the place of the category and its texts in both languages. */
export function SiteCategoryView({ category, parent }: Props) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const row = category.category;
  const problems = siteCategoryProblems(row, parent);
  const text = category[language];

  return (
    <Stack sx={{ gap: 2 }}>
      {problems.length > 0 && (
        <Alert severity="warning">
          Сайту бракує: {problems.map((problem) => problem.toLowerCase()).join('; ')}.
        </Alert>
      )}
      <ReferenceFormSection title="Розділ">
        <ReferenceDetailsList
          items={[
            { label: 'Показувати на сайті', value: row.showOnSite ? 'Так' : 'Ні' },
            {
              label: 'Де стоїть',
              value: parent ? `Підрозділ у «${siteCategoryName(parent)}»` : 'Верхній рівень',
            },
            { label: 'Адреса', value: `/catalog/${row.slug}`, mono: true },
            { label: 'Товарів', value: String(row.productCount), mono: true },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Тексти">
        <ContentLanguageTabs value={language} onChange={setLanguage} />
        <Stack sx={{ gap: 2 }}>
          <ContentPreviewPart title="Назва" text={text.name} />
          <ContentPreviewPart title="SEO-заголовок" text={text.seoTitle} />
          <ContentPreviewPart title="SEO-опис" text={text.seoDescription} />
          <ContentPreviewPart title="Текст розділу">
            <ContentBlocksPreview blocks={text.text} />
          </ContentPreviewPart>
        </Stack>
      </ReferenceFormSection>
    </Stack>
  );
}
