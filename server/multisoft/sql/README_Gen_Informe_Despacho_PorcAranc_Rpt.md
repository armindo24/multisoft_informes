## Generar `Gen_Informe_Despacho_PorcAranc_Rpt`

Este script toma el procedimiento original y arma la version de reporte:

- renombra `Gen_Informe_Despacho_PorcAranc` a `Gen_Informe_Despacho_PorcAranc_Rpt`
- elimina `declare cur_FactDesp ...`
- elimina el bloque final `open cur_FactDesp; ... close cur_FactDesp`

### Uso

1. Guarda el procedimiento original en un archivo, por ejemplo:

```sql
multisoft_informes/server/multisoft/sql/Gen_Informe_Despacho_PorcAranc_original.sql
```

2. Ejecuta:

```powershell
python multisoft_informes/server/multisoft/sql/build_gen_informe_despacho_porcaranc_rpt.py `
  multisoft_informes/server/multisoft/sql/Gen_Informe_Despacho_PorcAranc_original.sql `
  -o multisoft_informes/server/multisoft/sql/Gen_Informe_Despacho_PorcAranc_Rpt.sql
```

3. Revisa el archivo generado y pégalo en la base.

### Resultado esperado

El procedimiento generado:

- mantiene toda la carga de `tmpdespachos`
- no actualiza `FactDet`
- no dispara `FACTDET_AuditDB`
