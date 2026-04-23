'use client';

import { Building2, ImageIcon, Palette, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type BrandingConfigRecord = {
  empresa: string;
  scope: 'global' | 'empresa';
  clientName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
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
  updatedAt: null,
};

export function BrandingConfigPanel() {
  const [configs, setConfigs] = useState<BrandingConfigRecord[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('GLOBAL');
  const [form, setForm] = useState<BrandingConfigRecord>(emptyRecord);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    return configs.find((item) => item.empresa === selectedEmpresa) || {
      ...emptyRecord,
      empresa: selectedEmpresa,
      scope: selectedEmpresa === 'GLOBAL' ? 'global' : 'empresa',
    };
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
            <label className="text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4 text-cyan-700" />URL de logo</span>
              <input value={form.logoUrl} onChange={(event) => updateField('logoUrl', event.target.value)} placeholder="https://dominio/logo.png" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm text-slate-700 md:col-span-2">
              <span className="mb-2 flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4 text-cyan-700" />URL de favicon</span>
              <input value={form.faviconUrl} onChange={(event) => updateField('faviconUrl', event.target.value)} placeholder="https://dominio/favicon.ico" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Vista previa</p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">{form.clientName || 'Cliente'}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Informe corporativo</h3>
              <p className="mt-2 text-sm text-slate-500">{form.tagline || 'Informes ejecutivos y exportaciones con identidad visual propia.'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="h-14 w-14 rounded-xl border border-slate-200 object-contain p-1" /> : null}
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
