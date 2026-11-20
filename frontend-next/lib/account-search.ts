import type { AccountPlanOption } from '@/types/finanzas';

export function searchAccounts(options: AccountPlanOption[], search: string, descending = false) {
  const term = search.trim().toLowerCase();
  let result: AccountPlanOption[];
  if (/^\d+:$/.test(term)) {
    const prefix = term.slice(0, -1);
    const matching = options.filter((option) => option.value.startsWith(prefix));
    const imputable = matching.filter((option) => ['S', 'SI'].includes(option.imputable.trim().toUpperCase()));
    const candidates = imputable.length ? imputable : matching;
    const last = [...candidates].sort((a, b) => a.value.localeCompare(b.value)).at(-1);
    return last ? [last] : [];
  }
  if (/[;,]/.test(term)) {
    const codes = new Set(term.split(/[;,]/).map((code) => code.trim()).filter(Boolean));
    result = options.filter((option) => codes.has(option.value.toLowerCase()));
  } else if (/^\d+$/.test(term)) {
    result = options.filter((option) => option.value.startsWith(term));
  } else {
    result = options.filter((option) => !term || [option.value, option.name, option.label, option.moneda].some((value) => value.toLowerCase().includes(term)));
  }
  return [...result].sort((a, b) => descending ? b.value.localeCompare(a.value) : a.value.localeCompare(b.value));
}
