export const Role = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  CLIENT: 'cliente',
} as const;

export type Role = typeof Role[keyof typeof Role];
