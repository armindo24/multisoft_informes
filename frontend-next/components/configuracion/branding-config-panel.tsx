'use client';

import { Building2, ImageIcon, Palette, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getLogoBackgroundClasses, normalizeLogoBackground, resolveBrandAssetUrl } from '@/lib/branding';

type BrandingConfigRecord = {
  empresa: string;
  scope: 'global' | 'empresa';
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  logoBackground: 'auto' | 'light' | 'dark';
  updatedAt: string | null;
};

type CompanyOption = {
  value: string;
  label: string;
};

const emptyRecord: BrandingConfigRecord = {
  empresa: 'GLOBAL',
  scope: 'global',
  clientName: '',
  tagline: '',
  logoUrl: '',
  faviconUrl: '',
  logoBackground: 'auto',
  updatedAt: null,
};

function mergeBranding(globalConfig: BrandingConfigRecord | null, scopedConfig: BrandingConfigRecord | null, empresa: string) {
  if (!globalConfig && !scopedConfig) {
    return {
      ...emptyRecord,
      empresa,
      scope: empresa === 'GLOBAL' ? 'global' : 'empresa',
    };
  }

  if (!scopedConfig) {
    return {
      ...(globalConfig || emptyRecord),
      empresa,
      scope: empresa === 'GLOBAL' ? 'global' : 'empresa',
    };
  }

  if (!globalConfig || empresa === 'GLOBAL') {
    return scopedConfig;
  }

  return {
    ...globalConfig,
    ...scopedConfig,
    empresa,
    scope: 'empresa' as const,
    clientName: scopedConfig.clientName || globalConfig.clientName,
    tagline: scopedConfig.tagline || globalConfig.tagline,
    logoUrl: scopedConfig.logoUrl || globalConfig.logoUrl,
    faviconUrl: scopedConfig.faviconUrl || globalConfig.faviconUrl,
    logoBackground: scopedConfig.logoBackground !== 'auto' ? scopedConfig.logoBackground : globalConfig.logoBackground,
    updatedAt: scopedConfig.updatedAt || globalConfig.updatedAt,
  };
}

export function BrandingConfigPanel() {
  const [configs, setConfigs] = useState<BrandingConfigRecord[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('GLOBAL');
  const [form, setForm] = useState<BrandingConfigRecord>(emptyRecord);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo' | 'favicon' | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewWideLogo, setPreviewWideLogo] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setMessage(null);

      const [brandingResponse, empresasResponse] = await Promise.all([
        fetch('/api/config/branding', { cache: 'no-store' }),
        fetch('/proxy/empresa/select', { cache: 'no-store' }).catch(() => null),
      ]);

      const brandingPayload = (await brandingResponse.json().catch(() => ({}))) as {
        ok?: boolean;
        data?: BrandingConfigRecord[];
        message?: string;
      };

      if (!brandingResponse.ok || !brandingPayload.ok || !brandingPayload.data) {
        setMessage({ type: 'error', text: brandingPayload.message || 'No se pudo cargar la marca corporativa.' });
        setLoading(false);
        return;
      }

      const empresasPayload = empresasResponse
        ? ((await empresasResponse.json().catch(() => ({}))) as { data?: Array<Record<string, unknown>> })
        : {};

      const normalizedCompanies = Array.isArray(empresasPayload.data)
        ? empresasPayload.data
            .map((item) => {
              const code = String(item.Cod_Empresa || item.cod_empresa || '').trim();
              const name = String(item.Des_Empresa || item.des_empresa || code).trim();
              return code
                ? { value: code, label: code !== name ? `${code} · ${name}` : code }
                : null;
            })
            .filter(Boolean) as CompanyOption[]
        : [];

      setConfigs(brandingPayload.data);
      setCompanies(normalizedCompanies);
      setLoading(false);
    }

    void load();
  }, []);

  const currentRecord = useMemo<BrandingConfigRecord>(() => {
    const globalConfig = configs.find((item) => item.empresa === 'GLOBAL') || null;
    const scopedConfig = configs.find((item) => item.empresa === selectedEmpresa) || null;
    return mergeBranding(globalConfig, scopedConfig, selectedEmpresa);
  }, [configs, selectedEmpresa]);

  useEffect(() => {
    setForm(currentRecord);
  }, [currentRecord]);

  function updateField<K extends keyof BrandingConfigRecord>(key: K, value: BrandingConfigRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/config/branding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: BrandingConfigRecord;
      message?: string;
    };

    if (!response.ok || !payload.ok || !payload.data) {
      setMessage({ type: 'error', text: payload.message || 'No se pudo guardar la marca corporativa.' });
      setSaving(false);
      return;
    }

    setConfigs((current) => {
      const others = current.filter((item) => item.empresa !== payload.data!.empresa);
      return [...others, payload.data!].sort((left, right) => left.empresa.localeCompare(right.empresa, 'es'));
    });
    setForm(payload.data);
    setMessage({ type: 'success', text: 'Marca corporativa guardada correctamente.' });
    setSaving(false);
  }

  async function upload(kind: 'logo' | 'favicon') {
    const file = kind === 'logo' ? logoFile : faviconFile;
    if (!file) {
      setMessage({ type: 'error', text: `Seleccione un archivo de ${kind === 'logo' ? 'logo' : 'favicon'}.` });
      return;
    }

    setUploading(kind);
    setMessage(null);

    const payload = new FormData();
    payload.append('empresa', selectedEmpresa);
    payload.append('kind', kind);
    payload.append('file', file);

    const response = await fetch('/api/config/branding/upload', {
      method: 'POST',
      body: payload,
    });

    const result = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: { url?: string };
      message?: string;
    };

    if (!response.ok || !result.ok || !result.data?.url) {
      setMessage({ type: 'error', text: result.message || 'No se pudo subir el archivo.' });
      setUploading(null);
      return;
    }

    if (kind === 'logo') {
      updateField('logoUrl', result.data.url);
      setLogoFile(null);
    } else {
      updateField('faviconUrl', result.data.url);
      setFaviconFile(null);
    }

    setMessage({ type: 'success', text: `${kind === 'logo' ? 'Logo' : 'Favicon'} subido correctamente.` });
    setUploading(null);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className={['rounded-xl px-4 py-3 text-sm', message.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'].join(' ')}>
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Cargando marca corporativa...</div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
            <label className="text-sm text-slate-700">
              <span className="mb-2 block font-medium">Aplicar marca a</span>
              <select
                value={selectedEmpresa}
                onChange={(event) => setSelectedEmpresa(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <option value="GLOBAL">Global del sistema</option>
                {companies.map((company) => (
                  <option key={company.value} value={company.value}>{company.label}</option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
              La marca global se usa como respaldo. Si configuras una empresa, las exportaciones y reportes filtrados por esa empresa usaran su propia identidad corporativa.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              <span className="mb-2 flex items-center gap-2 font-medium"><Building2 className="h-4 w-4 text-cyan-700" />Nombre del cliente</span>
              <input value={form.clientName} onChange={(event) => updateField('clientName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 flex items-center gap-2 font-medium"><Palette className="h-4 w-4 text-cyan-700" />Tagline corporativo</span>
              <input value={form.tagline} onChange={(event) => updateField('tagline', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700">
              <span className="mb-2 flex items-center gap-2 font-medium"><Palette className="h-4 w-4 text-cyan-700" />Fondo del logo</span>
              <select
                value={form.logoBackground}
                onChange={(event) => updateField('logoBackground', normalizeLogoBackground(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <option value="auto">Automatico</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </label>
            <label className="text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4 text-cyan-700" />URL de logo</span>
              <input value={form.logoUrl} onChange={(event) => updateField('logoUrl', event.target.value)} placeholder="https://dominio/logo.png" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <label className="block flex-1 text-sm text-slate-700">
                  <span className="mb-2 block font-medium">Subir logo</span>
                  <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg,.ico" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </label>
                <button type="button" onClick={() => void upload('logo')} disabled={uploading !== null} className="rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-900 disabled:opacity-60">
                  {uploading === 'logo' ? 'Subiendo...' : 'Subir logo'}
                </button>
              </div>
            </div>
            <label className="text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4 text-cyan-700" />URL de favicon</span>
              <input value={form.faviconUrl} onChange={(event) => updateField('faviconUrl', event.target.value)} placeholder="https://dominio/favicon.ico" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <label className="block flex-1 text-sm text-slate-700">
                  <span className="mb-2 block font-medium">Subir favicon</span>
                  <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg,.ico" onChange={(event) => setFaviconFile(event.target.files?.[0] || null)} className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                </label>
                <button type="button" onClick={() => void upload('favicon')} disabled={uploading !== null} className="rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-medium text-cyan-900 disabled:opacity-60">
                  {uploading === 'favicon' ? 'Subiendo...' : 'Subir favicon'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Vista previa</p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">{form.clientName || 'Cliente'}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Informe corporativo</h3>
              <p className="mt-2 text-sm text-slate-500">{form.tagline || 'Informes ejecutivos y exportaciones con identidad visual propia.'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {form.logoUrl ? (
                  <div
                    className={[
                      'flex items-center justify-center rounded-xl px-3 py-2',
                      previewWideLogo ? 'min-h-16 max-w-[260px]' : 'min-h-16 max-w-[180px]',
                      getLogoBackgroundClasses(form.logoBackground),
                    ].join(' ')}
                  >
                    <img
                      src={resolveBrandAssetUrl(form.logoUrl)}
                      alt="Logo"
                      onLoad={(event) => {
                        const image = event.currentTarget;
                        const width = Number(image.naturalWidth || 0);
                        const height = Number(image.naturalHeight || 0);
                        setPreviewWideLogo(Boolean(width && height && width / height >= 2.15));
                      }}
                      className="max-h-12 w-auto max-w-full object-contain"
                    />
                  </div>
                ) : null}
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {selectedEmpresa === 'GLOBAL' ? 'Aplicacion global' : `Empresa ${selectedEmpresa}`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void submit()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar marca corporativa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
