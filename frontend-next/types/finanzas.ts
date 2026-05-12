export type SelectOption = {
  value: string;
  label: string;
  codigo_entidad?: string;
  es_casa_de_bolsa?: string;
};

export type AccountPlanOption = {
  value: string;
  label: string;
  name: string;
  imputable: string;
  auxiliar: string;
  moneda: string;
  nivel: string;
};

export type AuxiliarOption = {
  value: string;
  label: string;
  auxCode: string;
  accountCode: string;
  name: string;
};

export type BalanceRow = {
  CodPlanCta?: string;
  codplancta?: string;
  Nombre?: string;
  nombre?: string;
  SALDO_LOCAL?: string | number;
  saldo_local?: string | number;
  SALDO_ME?: string | number;
  saldo_me?: string | number;
  SALDO?: string | number;
  saldo?: string | number;
  TOTAL_DEBITO?: string | number;
  total_debito?: string | number;
  TOTAL_CREDITO?: string | number;
  total_credito?: string | number;
  TOTAL_DEBITOME?: string | number;
  total_debitome?: string | number;
  TOTAL_CREDITOME?: string | number;
  total_creditome?: string | number;
  Nivel?: string | number;
  nivel?: string | number;
};

export type FlowSection = {
  saldos?: Array<Record<string, unknown>>;
  movimientos?: Array<Record<string, unknown>>;
  descuentos?: Array<Record<string, unknown>>;
  bancos?: Array<Record<string, unknown>>;
};

export type CuentaPagarRow = {
  CodProv?: string;
  codprov?: string;
  RazonSocial?: string;
  razonsocial?: string;
  CodMoneda?: string;
  codmoneda?: string;
  Descrip?: string;
  descrip?: string;
  SaldoAnterior?: string | number;
  saldoanterior?: string | number;
  TotalCredito?: string | number;
  totalcredito?: string | number;
  TotalDebito?: string | number;
  totaldebito?: string | number;
  Saldo?: string | number;
  saldo?: string | number;
};

export type BalanceAuxRow = {
  CodPlanCta?: string;
  CodPlanAux?: string;
  Nombre?: string;
  Cuenta?: string;
  Debito?: string | number;
  Credito?: string | number;
  Saldo?: string | number;
};

export type DiarioRow = {
  EMPRESA?: string;
  empresa?: string;
  NroTransac?: string | number;
  nrotransac?: string | number;
  TipoAsiento?: string;
  tipoasiento?: string;
  NroCompr?: string | number;
  nrocompr?: string | number;
  Linea?: string | number;
  linea?: string | number;
  CodPlanCta?: string;
  codplancta?: string;
  CodPlanAux?: string;
  codplanaux?: string;
  Concepto?: string;
  concepto?: string;
  Fecha?: string;
  fecha?: string;
  DEBITO?: string | number;
  debito?: string | number;
  CREDITO?: string | number;
  credito?: string | number;
  DEBITO_ME?: string | number;
  debito_me?: string | number;
  CREDITO_ME?: string | number;
  credito_me?: string | number;
  NOMBRECUENTA?: string;
  nombrecuenta?: string;
  NOMBRECUENTAAUX?: string;
  nombrecuentaaux?: string;
  TIPOASIENTO?: string;
};
