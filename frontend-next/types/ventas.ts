export type SelectOption = {
  value: string;
  label: string;
};

export type VentaResumen = {
  cod_empresa?: string;
  cod_tp_comp?: string;
  comp_numero?: string;
  codmoneda?: string;
  cod_cliente?: string;
  razon_social?: string;
  cliente?: string;
  ruc?: string;
  fecha?: string;
  cod_usuario?: string;
  to_exento?: number | string;
  to_gravado?: number | string;
  total_iva?: number | string;
  totaldescuento?: number | string;
  des_tp_comp?: string;
  des_vendedor?: string;
};

export type VentaDetalle = {
  cod_deposito?: string;
  cod_articulo?: string;
  descrip?: string;
  lista_prec?: string;
  cantidad?: number | string;
  pr_unit?: number | string;
  descuento?: number | string;
  total_neto?: number | string;
  linea?: number | string;
};

export type RankingItem = {
  label: string;
  total: number;
};

export type CuentaCobrar = {
  cuota_numero?: string | number;
  cod_cliente?: string;
  razon_social?: string;
  comp_numero?: string;
  cod_tp_comp?: string;
  des_tp_comp?: string;
  fecha_ven?: string;
  fecha_emi?: string;
  saldo?: number | string;
  importe?: number | string;
};
