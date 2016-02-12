var conn = require('../db');
var util = require('util');

var ExtractoCuenta = {};

ExtractoCuenta.depositos = function (params, query, cb) {
    console.log(params);
    console.log(query);
    var columns = "date(d.fecha) as fecha, d.cuentabanco, d.nrodeposito, dd.tot_efectivo, d.observ";
    var table = "dba.depcuenta d";
    var join_table = "dba.depcuentadet dd";
    var join_cond = "(dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco and dd.cod_empresa = d.cod_empresa)";
    var cond = "d.cod_empresa = ? and d.codbanco = ? and d.cuentabanco = ? and fecha between ? and ? and d.estado = 'A'";
    var sql_params = [params.empresa, query.banco, query.cuenta, query.fechad, query.fechah];
    if (query.sucursal) {
        cond += " and d.cod_sucursal = ?";
        sql_params.push(query.sucursal);
    }
    var sql = util.format("SELECT %s FROM %s JOIN %s on %s WHERE %s ORDER BY fecha", columns, table, join_table, join_cond, cond);
    var tot_sql = util.format("SELECT sum(dd.tot_efectivo) as total, avg(dd.tot_efectivo) FROM %s JOIN %s on %s WHERE %s", table, join_table, join_cond, cond);
    console.log(sql);
    console.log(tot_sql);

    conn.exec(sql, sql_params, function (err, row) {
        if (err) throw err;
        conn.exec(tot_sql, sql_params, function (err, aggr) {
            if (err) throw err;
            cb(row, aggr);
        });
    });
};

ExtractoCuenta.extracciones = function (params, query, cb) {
    console.log(params);
    console.log(query);
    var columns = "date(e.fecha) as fecha, e.codbanco, e.extraccionnro, e.beneficiario, e.importe, e.observ";
    var table = "dba.extcuenta e";
    var cond = "e.cod_empresa = ? and e.cuentabanco = ? and e.codbanco = ? and fecha between ? and ? and e.anulado = 'N' and e.estado = 'A'";
    var order = "fecha";
    var sql = util.format("SELECT %s FROM %s WHERE %s ORDER BY %s", columns, table, cond, order);
    //var tot_sql = util.format("SELECT sum(e.importe) as total FROM %s WHERE %s", table, cond);
    var sql_params = [params.empresa, query.banco, query.cuenta, query.fechad, query.fechah];

    var sql =
        " SELECT dba.extcuenta.cod_empresa,   " +
        "        dba.empresa.des_empresa,   " +
        "        dba.cuentabancaria.nombre,  " +
        "        dba.extcuenta.codbanco,  " +
        "        dba.extcuenta.cuentabanco,   " +
        "        dba.extcuenta.fecha,  " +
        "        string (dba.extcuenta.extraccionnro),  " +
        "        dba.extcuenta.nrocheque             ,  " +
        "        dba.cuentabancaria.codmoneda,  " +
        "        dba.f_get_BancoDescrip (cuentabancaria.codbanco) AS Banco_Descrip,   " +
        "        sum (dba.extcuenta.importe) as Total,  " +
        "        0 As SInicial,  " +
        "        'E' as Tipo  " +
        " FROM	dba.extcuenta,  " +
        "       dba.empresa,  " +
        "       dba.cuentabancaria  " +

        " WHERE	dba.extcuenta.cod_empresa = dba.cuentabancaria.cod_empresa  " +
        " and	dba.extcuenta.codbanco	  	  = dba.cuentabancaria.codbanco  " +
        " and	dba.extcuenta.cuentabanco 	  = dba.cuentabancaria.cuentabanco  " +
        " and	dba.extcuenta.cod_empresa    = dba.empresa.cod_empresa  " +
        " and	dba.extcuenta.Anulado		  = 'N'  " +
        " and	dba.extcuenta.Estado			  = 'A'  " +
        " and dba.extcuenta.Cod_Empresa = ? and dba.extcuenta.Codbanco = ? and dba.extcuenta.cuentaBanco = ? " +
        " and dba.extcuenta.fechavtocheque between ? and ? " +

        " GROUP BY dba.extcuenta.cod_empresa,   " +
        "        dba.empresa.des_empresa,   " +
        "        dba.cuentabancaria.nombre,  " +
        "        dba.extcuenta.codbanco,  " +
        "        dba.extcuenta.cuentabanco,   " +
        "        dba.extcuenta.fecha,  " +
        "        dba.extcuenta.extraccionnro,  " +
        "        Banco_Descrip,  " +
        "        dba.extcuenta.nrocheque,  " +
        "        dba.cuentabancaria.codmoneda " +
        " 		  " +
        " UNION " +

        " SELECT dba.depcuentadet.cod_empresa,  " +
        "        dba.empresa.des_empresa,  " +
        "        dba.cuentabancaria.nombre,  " +
        "        dba.depcuentadet.codbanco,  " +
        "        dba.depcuentadet.cuentabanco,  " +
        "        dba.depcuenta.fecha,  " +
        "        dba.depcuentadet.nrodeposito,  " +
        "        dba.depcuentadet.nrocheque,  " +
        "        dba.cuentabancaria.codmoneda,   " +
        "        dba.f_get_BancoDescrip (depcuentadet.codbanco) as Banco_Descrip,  " +
        "        dba.depcuentadet.tot_efectivo as Total,  " +
        "        0 As SInicial,  " +
        "        'E' as Tipo  " +
        " FROM dba.depcuenta,  " +
        "      dba.depcuentadet,  " +
        "      dba.cuentabancaria,  " +
        "      dba.empresa  " +
        " WHERE dba.depcuenta.cod_empresa 		= dba.depcuentadet.cod_empresa  " +
        " and	dba.depcuenta.codbanco			= dba.depcuentadet.codbanco  " +
        " and	dba.depcuenta.cuentabanco		= dba.depcuentadet.cuentabanco  " +
        " and	dba.depcuenta.nrodeposito		= dba.depcuentadet.nrodeposito  " +
        " and	dba.depcuentadet.cod_empresa  = dba.cuentabancaria.cod_empresa  " +
        " and	dba.depcuentadet.codbanco	   = dba.cuentabancaria.codbanco  " +
        " and	dba.depcuentadet.cuentabanco  = dba.cuentabancaria.cuentabanco  " +
        " and	dba.depcuentadet.cod_empresa  = dba.empresa.cod_empresa  " +
        " and	dba.depcuentadet.estado       = 'R' " +
        " and dba.depcuentadet.Cod_Empresa = ? and dba.depcuentadet.Codbanco = ? and dba.depcuentadet.cuentaBanco = ? " +
        " and dba.depcuentadet.fechaacreditacion between ? and ? ";

    //console.log(sql);
    console.log(sql_params);
    //console.log(tot_sql);
    conn.exec(sql, sql_params.concat(sql_params), function (err, row) {
        if (err) throw err;
        cb(row);
    });
};


ExtractoCuenta.saldoAnterior = function (params, query, cb) {
    console.log(params);
    console.log(query);
    //TODO: check sucursal filter
    var depositos = "SELECT sum(dd.tot_efectivo) FROM dba.depcuenta d JOIN dba.depcuentadet dd on (dd.nrodeposito = d.nrodeposito and dd.Codbanco = d.Codbanco and dd.cod_empresa = d.cod_empresa) " +
        "WHERE d.cod_empresa = ? and d.codbanco = ? and d.cuentabanco = ? " +
        "and fecha between ? and ? and d.estado = 'A'";
    var extracciones = "SELECT sum(e.importe) FROM dba.extcuenta e " +
        "WHERE e.cod_empresa = ? and e.cuentabanco = ? and e.codbanco = ? " +
        "and fecha between ? and ? and e.anulado = 'N' and e.estado = 'A'";

    var sql = util.format("%s UNION %s", depositos, extracciones);
    var sql_params = [params.empresa, query.banco, query.cuenta, '1901-01-01', query.fechad];
    sql_params = sql_params.concat(sql_params);
    console.log(sql);
    console.log(sql_params);
    var sql = "select sum(dd.tot_efectivo) as total from dba.depcuenta d join dba.depcuentadet dd on d.nrodeposito = dd.nrodeposito and d.Cod_Empresa = dd.Cod_Empresa and d.Codbanco = dd.Codbanco and d.cuentabanco = dd.cuentabanco " +
        "where d.codbanco = ? and d.Cod_Empresa = ? and d.cuentabanco = ? and d.fecha between '1901-01-01' and ? and d.estado = 'A' " +
        "UNION " +
        "select sum(e.importe) from dba.extcuenta e " +
        "where e.codbanco = ? and e.Cod_Empresa = ? and e.cuentabanco = ? and e.fecha between '1901-01-01' and ? and e.anulado = 'N' and e.estado = 'A'";

    var sql_params = [query.banco, params.empresa, query.cuenta, query.fechad];
    conn.exec(sql, sql_params.concat(sql_params), function (err, row) {
        if (err) throw err;
        cb(row);
    })
};

//TODO: Hacer mas lindo
ExtractoCuenta.resumido = function (params, query, cb) {
    var sql = "SELECT dba.depcuentadet.cod_empresa, " + "" +
        "dba.empresa.des_empresa, " + "" +
        "dba.cuentabancaria.nombre, " + "" +
        "dba.depcuentadet.codbanco, " + "" +
        "dba.depcuentadet.cuentabanco, " + "" +
        "dba.depcuenta.fecha, " + "" +
        "dba.depcuentadet.nrodeposito, " + "" +
        "'0' nrocheque, " + "" +
        "dba.cuentabancaria.codmoneda,  " + "" +
        "dba.f_get_BancoDescrip (depcuentadet.codbanco) as Banco_Descrip, " + "" +
        "sum (dba.depcuentadet.tot_efectivo) as Total, " + "" +
        "0 As SInicial," + "" +
        "'D' as Tipo " + "" +
        "FROM dba.depcuenta, " + "" +
        "dba.depcuentadet, " + "" +
        "dba.cuentabancaria, " + "" +
        "dba.empresa " + "" +
        "WHERE dba.depcuenta.cod_empresa 		= dba.depcuentadet.cod_empresa " + "" +
        "and	dba.depcuenta.codbanco			= dba.depcuentadet.codbanco " + "" +
        "and	dba.depcuenta.cuentabanco		= dba.depcuentadet.cuentabanco " + "" +
        "and	dba.depcuenta.nrodeposito		= dba.depcuentadet.nrodeposito " + "" +
        "and	dba.depcuentadet.cod_empresa  = dba.cuentabancaria.cod_empresa " + "" +
        "and	dba.depcuentadet.codbanco	   = dba.cuentabancaria.codbanco " + "" +
        "and	dba.depcuentadet.cuentabanco  = dba.cuentabancaria.cuentabanco " + "" +
        "and	dba.depcuentadet.cod_empresa  = dba.empresa.cod_empresa " + "" +
        "and dba.depcuenta.Cod_Empresa = ? and dba.depcuenta.Codbanco = ? and dba.depcuenta.cuentaBanco = ? " +
        "and dba.depcuentadet.fechaacreditacion between ? and ? " +
        "GROUP BY dba.depcuentadet.cod_empresa,  " + "" +
        "         dba.empresa.des_empresa,  " + "" +
        "         dba.cuentabancaria.nombre, " + "" +
        "         dba.depcuentadet.codbanco, " + "" +
        "         dba.depcuentadet.cuentabanco, " + "" +
        "         dba.depcuenta.fecha, " + "" +
        "         dba.depcuentadet.nrodeposito, " + "" +
        "         Banco_Descrip ," + "" +
        "         dba.cuentabancaria.codmoneda  " + "" +
        "" +
        "UNION " +
        "SELECT dba.extcuenta.cod_empresa,  " + "" +
        "       dba.empresa.des_empresa,  " + "" +
        "       dba.cuentabancaria.nombre, " + "" +
        "       dba.extcuenta.codbanco, " + "" +
        "       dba.extcuenta.cuentabanco,  " + "" +
        "       dba.extcuenta.fecha, " + "" +
        "       string (dba.extcuenta.extraccionnro), " + "" +
        "       dba.extcuenta.nrocheque             , " + "" +
        "       dba.cuentabancaria.codmoneda, " + "" +
        "       dba.f_get_BancoDescrip (cuentabancaria.codbanco) AS Banco_Descrip,  " + "" +
        "       sum (dba.extcuenta.importe) as Total, " + "" +
        "       0 As SInicial, " + "" +
        "       'E' as Tipo " + "" +
        "FROM	dba.extcuenta, " + "" +
        "      dba.empresa, " + "" +
        "      dba.cuentabancaria " + "" +
        "" +
        "WHERE	dba.extcuenta.cod_empresa = dba.cuentabancaria.cod_empresa " + "" +
        "and	dba.extcuenta.codbanco	  	  = dba.cuentabancaria.codbanco " + "" +
        "and	dba.extcuenta.cuentabanco 	  = dba.cuentabancaria.cuentabanco " + "" +
        "and	dba.extcuenta.cod_empresa    = dba.empresa.cod_empresa " + "" +
        "and	dba.extcuenta.Anulado		  = 'N' " + "" +
        "and	dba.extcuenta.Estado			  = 'A' " + "" +
        "and dba.extcuenta.Cod_Empresa = ? and dba.extcuenta.Codbanco = ? and dba.extcuenta.cuentaBanco = ?" + "" +
        "and dba.extcuenta.fechavtocheque between ? and ? " +
        "GROUP BY dba.extcuenta.cod_empresa,  " + "" +
        "       dba.empresa.des_empresa,  " + "" +
        "       dba.cuentabancaria.nombre, " + "" +
        "       dba.extcuenta.codbanco, " + "" +
        "       dba.extcuenta.cuentabanco,  " + "" +
        "       dba.extcuenta.fecha, " + "" +
        "       dba.extcuenta.extraccionnro, " + "" +
        "       Banco_Descrip, " + "" +
        "       dba.extcuenta.nrocheque, " + "" +
        "       dba.cuentabancaria.codmoneda " +
        "UNION " +
        "SELECT dba.depcuentadet.cod_empresa, " + "" +
        "       dba.empresa.des_empresa, " + "" +
        "       dba.cuentabancaria.nombre, " + "" +
        "       dba.depcuentadet.codbanco, " + "" +
        "       dba.depcuentadet.cuentabanco, " + "" +
        "       dba.depcuenta.fecha, " + "" +
        "       dba.depcuentadet.nrodeposito, " + "" +
        "       dba.depcuentadet.nrocheque, " + "" +
        "       dba.cuentabancaria.codmoneda,  " + "" +
        "       dba.f_get_BancoDescrip (depcuentadet.codbanco) as Banco_Descrip, " + "" +
        "       dba.depcuentadet.tot_efectivo as Total, " + "" +
        "       0 As SInicial, " + "" +
        "       'E' as Tipo " + "" +
        "FROM dba.depcuenta, " + "" +
        "     dba.depcuentadet, " + "" +
        "     dba.cuentabancaria, " + "" +
        "     dba.empresa " + "" +
        " WHERE dba.depcuenta.cod_empresa 		= dba.depcuentadet.cod_empresa " + "" +
        "and	dba.depcuenta.codbanco			= dba.depcuentadet.codbanco " + "" +
        "and	dba.depcuenta.cuentabanco		= dba.depcuentadet.cuentabanco " + "" +
        "and	dba.depcuenta.nrodeposito		= dba.depcuentadet.nrodeposito " + "" +
        " " + "" +
        "and	dba.depcuentadet.cod_empresa  = dba.cuentabancaria.cod_empresa " + "" +
        "and	dba.depcuentadet.codbanco	   = dba.cuentabancaria.codbanco " + "" +
        "and	dba.depcuentadet.cuentabanco  = dba.cuentabancaria.cuentabanco " + "" +
        "and	dba.depcuentadet.cod_empresa  = dba.empresa.cod_empresa " + "" +
        "and	dba.depcuentadet.estado       = 'R'" + "" +
        "and dba.depcuentadet.Cod_Empresa = ? and dba.depcuentadet.Codbanco = ? and dba.depcuentadet.cuentaBanco = ?" + "" +
        "and dba.depcuentadet.fechaacreditacion between ? and ? " +
        "ORDER BY fecha";

    var sql_params = [params.empresa, query.banco, query.cuenta, query.fechad, query.fechah];
    var sql_params_repeat = sql_params.concat(sql_params).concat(sql_params);
    console.log(sql_params_repeat);
    conn.exec(sql, sql_params_repeat, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

ExtractoCuenta.detallado = function (params, query, cb) {
    var sql = " SELECT dba.depcuentadet.cod_empresa, " +
        "						 dba.depcuentadet.codbanco    , " +
        "						 dba.depcuentadet.cuentabanco, " +
        "						 dba.depcuentadet.nrodeposito      , " +
        "						 dba.depcuentadet.linea       , " +
        "						 dba.depcuentadet.codbancocheque, " +
        "						 dba.depcuentadet.codplaza         , " +
        "						 dba.depcuentadet.cod_sucursal, " +
        "						 dba.depcuentadet.nroplanilla, " +
        "						 dba.depcuentadet.tot_efectivo as tot_credito, " +
        "						 0 as tot_debito, " +
        "						 dba.depcuentadet.nrocheque   , " +
        "						 dba.depcuentadet.lineacheque, " +
        "						 dba.depcuentadet.fechaacreditacion, " +
        "						 dba.depcuentadet.estado      , " +
        "						 dba.empresa.des_empresa as Beneficiario, " +
        "						 dba.f_get_BancoDescrip (depcuentadet.codbanco) , " +
        "						 dba.cuentabancaria.nombre          , " +
        "						 dba.empresa.des_empresa      , " +
        "						 0 As SInicial, " +
        "						 dba.moneda.CantDecimal, " +
        "						 dba.depcuenta.observ " +
        "				FROM   dba.depcuentadet, " +
        "						 dba.empresa, " +
        " 						 dba.moneda, " +
        "						 dba.cuentabancaria, " +
        "						 dba.depcuenta	 " +
        "	       WHERE    dba.depcuenta.cod_empresa = dba.depcuentadet.cod_empresa 	and " +
        "						 dba.depcuenta.codbanco	 = dba.depcuentadet.codbanco		and " +
        "						 dba.depcuenta.cuentabanco = dba.depcuentadet.cuentabanco	        and " +
        "						 dba.depcuenta.nrodeposito = dba.depcuentadet.nrodeposito         and " +
        "						 dba.cuentabancaria.codmoneda = dba.moneda.codmoneda and " +
        "						 dba.depcuentadet.cod_empresa = dba.cuentabancaria.cod_empresa    and " +
        "						 dba.depcuentadet.codbanco = dba.cuentabancaria.codbanco		and " +
        "						 dba.depcuentadet.cuentabanco = dba.cuentabancaria.cuentabanco	and " +
        "						 dba.depcuenta.cod_empresa 	= dba.empresa.cod_empresa	and " +
        "						 dba.depcuenta.cod_empresa 	= ? and dba.depcuenta.codbanco = ? and dba.depcuenta.cuentabanco = ? and " +
        "                         dba.depcuentadet.fechaacreditacion between ? and ? " +

        "UNION " +

        " SELECT dba.depcuentadet.cod_empresa,  " +
        "						 dba.depcuentadet.codbanco    ,  " +
        "						 dba.depcuentadet.cuentabanco,  " +
        "						 dba.depcuentadet.nrodeposito      ,  " +
        "						 dba.depcuentadet.linea       ,  " +
        "						 dba.depcuentadet.codbancocheque,  " +
        "						 dba.depcuentadet.codplaza         ,  " +
        "						 dba.depcuentadet.cod_sucursal,  " +
        "						 dba.depcuentadet.nroplanilla,  " +
        "						 0 tot_credito, " +
        "						 dba.depcuentadet.tot_efectivo as tot_debito, " +
        "						 dba.depcuentadet.nrocheque   ,  " +
        "						 dba.depcuentadet.lineacheque,  " +
        "						 dba.depcuentadet.fechaacreditacion,  " +
        "						 dba.depcuentadet.estado      ,  " +
        "						 dba.empresa.des_empresa as Beneficiario,  " +
        "						 dba.f_get_BancoDescrip (depcuentadet.codbanco) ,  " +
        "						 dba.cuentabancaria.nombre          ,  " +
        "						 dba.empresa.des_empresa      ,  " +
        "						 0 As SInicial,   " +
        "						 dba.moneda.CantDecimal,  " +
        "						 dba.depcuenta.observ       " +
        "				FROM   dba.depcuentadet,  " +
        "						  dba.empresa,  " +
        "						  dba.moneda,  " +
        "						  dba.cuentabancaria,  " +
        "						  dba.depcuenta 	 " +
        "	       WHERE    dba.depcuenta.cod_empresa = dba.depcuentadet.cod_empresa 	and  " +
        "						 dba.depcuenta.codbanco	 = dba.depcuentadet.codbanco		and  " +
        "						 dba.depcuenta.cuentabanco = dba.depcuentadet.cuentabanco	        and  " +
        "						 dba.depcuenta.nrodeposito = dba.depcuentadet.nrodeposito         and  " +
        "						 dba.cuentabancaria.codmoneda = dba.moneda.codmoneda and  " +
        "						 dba.depcuentadet.cod_empresa = dba.cuentabancaria.cod_empresa    and  " +
        "						 dba.depcuentadet.codbanco = dba.cuentabancaria.codbanco		and  " +
        "						 dba.depcuentadet.cuentabanco = dba.cuentabancaria.cuentabanco	and  " +
        "						 dba.depcuenta.cod_empresa 	= dba.empresa.cod_empresa	and  " +
        "						 dba.depcuentadet.estado	   = 'R' and " +
        "                         dba.depcuenta.cod_empresa 	= ? and dba.depcuenta.codbanco = ?  and dba.depcuenta.cuentabanco = ? and " +
        "                         dba.depcuentadet.fechaacreditacion between ? and ? " +
        "                          " +
        "UNION " +

        "SELECT dba.extcuenta.cod_empresa, " +
        "     dba.extcuenta.codbanco    , " +
        "     dba.extcuenta.cuentabanco, " +
        "     string (dba.extcuenta.extraccionnro), " +
        "     dba.extcuenta.nroop      , " +
        "     dba.extcuenta.codbanco    , " +
        "     NULL as Plaza, " +
        "     NULL as Sucursal, " +
        "     dba.extcuenta.nroop      , " +
        "     0 as tot_credito, " +
        "     dba.extcuenta.importe as tot_debito, " +
        "     dba.extcuenta.nrocheque   , " +
        "     1 as LineaCheque, " +
        "     dba.extcuenta.fechavtocheque	, " +
        "     dba.extcuenta.Estado, " +
        "     dba.extcuenta.beneficiario, " +
        "     dba.f_get_BancoDescrip (extcuenta.codbanco), " +
        "     dba.cuentabancaria.nombre , " +
        "     dba.empresa.des_empresa, " +
        "     0 As SInicial, " +
        "     dba.moneda.CantDecimal, " +
        "     dba.opcab.concepto " +
        "FROM   dba.extcuenta, " +
        "      dba.opcab, " +
        "     dba.empresa, " +
        "     dba.moneda, " +
        "     dba.cuentabancaria " +
        "WHERE  dba.extcuenta.cod_empresa 	= dba.cuentabancaria.cod_empresa and " +
        "     dba.extcuenta.codbanco	  	= dba.cuentabancaria.codbanco	 and " +
        "     dba.extcuenta.cuentabanco 	= dba.cuentabancaria.cuentabanco and			 " +
        "     dba.cuentabancaria.codmoneda = dba.moneda.codmoneda and " +
        "     dba.extcuenta.cod_empresa        = dba.empresa.cod_empresa	and		 " +
        "     dba.extcuenta.cod_empresa    = dba.opcab.cod_empresa	and " +
        "     dba.extcuenta.tipoop         = dba.opcab.tipoop and " +
        "     dba.extcuenta.nroop          = dba.opcab.nroop	and " +
        "     dba.extcuenta.anulado		= 'N'	and " +
        "     dba.extcuenta.Estado		= 'A' " +
        "     and dba.extcuenta.Cod_Empresa = ? and dba.extcuenta.Codbanco = ? and dba.extcuenta.cuentaBanco = ? " +
        "     and dba.extcuenta.fechavtocheque between ? and ? ";
    //console.log(sql);
    var sql_params = [params.empresa, query.banco, query.cuenta, query.fechad, query.fechah];
    var sql_params_repeat = sql_params.concat(sql_params).concat(sql_params);
    console.log(sql_params_repeat);
    conn.exec(sql, sql_params_repeat, function (err, row) {
        if (err) throw err;
        cb(row);
    });
};

module.exports = ExtractoCuenta;