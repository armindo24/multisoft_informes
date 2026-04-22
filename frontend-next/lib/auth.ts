export const AUTH_COOKIE = 'multisoft_session';

export type SessionUser = {
  id?: number;
  username: string;
  role: string;
  displayName: string;
  isSuperuser?: boolean;
  groups?: string[];
};

export function getDefaultUser(): SessionUser {
  return {
    username: process.env.DEMO_LOGIN_USER || 'admin',
    role: 'Administrador',
    displayName: 'admin',
    isSuperuser: true,
    groups: ['Admin'],
  };
}
