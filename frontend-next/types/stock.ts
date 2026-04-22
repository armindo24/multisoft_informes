export type SelectOption = {
  value: string;
  label: string;
};

export type StockDepositoRow = {
  cod_familia?: string;
  cod_grupo?: string;
  cod_articulo?: string;
  cod_original?: string;
  referencia?: string;
  des_art?: string;
  pto_pedido?: number | string;
  existencia?: number | string;
  cod_deposito?: string;
  cod_sucursal?: string;
  des_familia?: string;
};

export type StockValorizadoRow = {
  cod_sucursal?: string;
  cod_deposito?: string;
  des_sucursal?: string;
  des_deposito?: string;
  cod_familia?: string;
  des_familia?: string;
  cod_grupo?: string;
  des_grupo?: string;
  cod_articulo?: string;
  cod_original?: string;
  des_art?: string;
  costo?: number | string;
  total_existencia?: number | string;
};

export type StockCostoArticuloFullRow = {
  cod_articulo?: string;
  des_art?: string;
  cod_tp_art?: string;
  estado?: string;
  cto_prom_gs?: number | string;
  cto_ult_gs?: number | string;
  cto_prom_me?: number | string;
  cto_ult_me?: number | string;
  codmoneda?: string;
  cod_iva?: string;
  iva?: number | string;
  existencia?: number | string;
  [key: string]: unknown;
};
