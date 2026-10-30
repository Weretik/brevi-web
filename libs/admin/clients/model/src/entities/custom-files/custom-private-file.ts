export interface CustomFileSelection {
  readonly fileId: string;
  readonly showInQuote: boolean;
  readonly production: boolean;
}

export interface CustomPrivateFile {
  readonly id: string;
  readonly draftId: string;
  readonly contentType: 'application/pdf' | 'image/jpeg' | 'image/png';
  readonly length: number;
  readonly sha256: string;
  readonly state: 'Uploaded';
  readonly expiresAt: string;
  readonly showInQuote: boolean;
  readonly production: boolean;
  readonly isFinalized: boolean;
}
