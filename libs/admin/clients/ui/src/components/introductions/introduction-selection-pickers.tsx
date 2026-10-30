import { IntroductionOptionPicker } from './introduction-option-picker';
import type { IntroductionArticleOption, IntroductionModelOption } from '@admin/clients/model';

interface PickerActions {
  open: boolean;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onSelect: (id: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function IntroductionModelPicker({
  options,
  ...props
}: PickerActions & { options: readonly IntroductionModelOption[] }) {
  return (
    <IntroductionOptionPicker
      {...props}
      title="Оберіть модель"
      options={options.map((option) => ({
        id: option.productId,
        label: option.label,
        description:
          option.season === 'summer' ? 'Літо' : option.season === 'winter' ? 'Зима' : undefined,
      }))}
    />
  );
}

export function IntroductionArticlePicker({
  options,
  ...props
}: PickerActions & { options: readonly IntroductionArticleOption[] }) {
  return (
    <IntroductionOptionPicker
      {...props}
      title="Оберіть тканину та артикул"
      options={options.map((option) => ({
        id: option.articleId,
        label: option.label,
        description: option.description,
      }))}
    />
  );
}
