export type BrandingConfig = {
  appName: string;
  clientName: string;
  tagline: string;
  logoUrl: string;
};

export function getBranding(): BrandingConfig {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Multisoft Informes',
    clientName: process.env.NEXT_PUBLIC_CLIENT_NAME || 'Multisoft',
    tagline: process.env.NEXT_PUBLIC_CLIENT_TAGLINE || 'Informes Gerenciales',
    logoUrl: process.env.NEXT_PUBLIC_CLIENT_LOGO_URL || '',
  };
}

export function brandShortName(value: string) {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return 'MS';
  return words.map((item) => item[0]?.toUpperCase() || '').join('');
}
