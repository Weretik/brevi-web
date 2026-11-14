export const customerListTag = { type: 'Customer' as const, id: 'LIST' };
export function customerDetailTag(id: string) {
  return { type: 'Customer' as const, id };
}
export function changedCustomerTags(id: string) {
  return [customerListTag, customerDetailTag(id)];
}
