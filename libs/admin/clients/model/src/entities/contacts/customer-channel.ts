export interface CustomerChannel {
  readonly kind: 'email' | 'phone';
  readonly value: string;
}
