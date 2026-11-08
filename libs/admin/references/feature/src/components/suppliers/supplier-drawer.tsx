import { CounterpartyFinance } from '@admin/accounting/feature';
import { SupplierPurchaseInvoices } from '@admin/purchasing/feature';
import { SupplierEditorDrawer } from '@admin/references/ui';

import { useSupplierEditor } from '../../hooks/suppliers/use-supplier-editor';

import type { Supplier, SupplierDialogMode } from '@admin/references/model';

interface Props {
  mode: SupplierDialogMode;
  supplier: Supplier | null;
  nextId: number;
  onClose: () => void;
  onSaved: () => void;
  /** Accountant, Admin and Director: the viewed card gets the tab «Рахунки на закупку». */
  canSeePurchaseInvoices?: boolean;
  /** The «Бухгалтерія» right: the viewed card gets the tab «Фінанси». */
  canSeeFinance?: boolean;
}

export function SupplierDrawer({
  mode,
  supplier,
  nextId,
  onClose,
  onSaved,
  canSeePurchaseInvoices = false,
  canSeeFinance = false,
}: Props) {
  const editor = useSupplierEditor(mode, supplier, nextId, onSaved);
  return (
    <SupplierEditorDrawer
      mode={editor.mode}
      draft={editor.draft}
      errors={editor.errors}
      message={editor.message}
      saving={editor.saving}
      keepinCrmId={supplier?.keepinCrmId ?? null}
      invoices={
        canSeePurchaseInvoices && supplier ? (
          <SupplierPurchaseInvoices supplierId={supplier.id} />
        ) : undefined
      }
      finance={
        canSeeFinance && supplier ? (
          <CounterpartyFinance kind="Supplier" id={String(supplier.id)} />
        ) : undefined
      }
      onChange={editor.change}
      onSave={() => void editor.save()}
      onEnableEditing={editor.enableEditing}
      onClose={onClose}
    />
  );
}
