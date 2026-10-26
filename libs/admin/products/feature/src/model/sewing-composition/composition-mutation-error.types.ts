export interface CompositionMutationError {
  message: string;
  fieldErrors: Record<string, string>;
  stale: boolean;
}
