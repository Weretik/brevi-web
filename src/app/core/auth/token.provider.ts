export abstract class TokenProvider {
  abstract getAccessToken(): string | null;
}
