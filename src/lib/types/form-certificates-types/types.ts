export type BirthCertificateResponse =
  | { success: true; data: any; message: string }
  | { success: false; error: string; message: string; warning?: boolean };

export type DeathCertificateResponse =
  | { success: true; data: any; message: string }
  | { success: false; error: string; message: string; warning?: boolean };
