/** Outcome of «Оновити з KeepinCRM» for clients; `applied` is false for a preview. */
export interface CustomerKeepinSyncResult {
  readonly applied: boolean;
  readonly received: number;
  readonly created: number;
  readonly updated: number;
  readonly unchanged: number;
  /** Linked clients missing from KeepinCRM, marked not used. */
  readonly deactivated: readonly string[];
  readonly deleted: readonly string[];
  readonly hiddenInUse: readonly string[];
}
