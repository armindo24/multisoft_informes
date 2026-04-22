export type SelectOption = {
  value: string;
  label: string;
};

export type CompraRow = {
  estado?: string;
  FechaFact?: string;
  fecha_fact?: string;
  Cod_Tp_Comp?: string;
  cod_tp_comp?: string;
  NroFact?: string;
  nrofact?: string;
  RazonSocial?: string;
  razon_social?: string;
  descrip?: string;
  des_sucursal?: string;
  gravada?: number | string;
  IVA?: number | string;
  iva?: number | string;
  total?: number | string;
  TotalExen?: number | string;
  Asentado?: string;
  TipoCompra?: string;
};

export type OrdenCompraRow = {
  nroordcomp?: string;
  fechaorden?: string;
  razonsocial?: string;
  responsable?: string;
  estado?: string;
  porccumplido?: number | string;
  descrip?: string;
  total?: number | string;
  codmoneda?: string;
};

export type RankingCompraItem = {
  CodProv?: string;
  RazonSocial?: string;
  Cod_Articulo?: string;
  Des_Art?: string;
  TotalCompras?: number | string;
  TotalItem?: number | string;
};
