import { useStableRequest } from './use-stable-request';

export function useCustomerRequest() {
  return useStableRequest().id;
}
