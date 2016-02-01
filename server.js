var express = require('express');
var restapi = express();
var sqlanywhere = require('sqlanywhere');
var conn = sqlanywhere.createConnection();

var cstr = {
    Host: '192.168.51.139:2638', Server: 'integrado',
    UserID: 'dba', Password: 'ownnetmasterkey', DatabaseName: 'integrado'
};

conn.connect(cstr, function (err) {

    //empresas select option
    restapi.get('/api/v1/empresa/select', function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        conn.exec("select Cod_Empresa,Des_Empresa from dba.EMPRESA", function (err, row) {
            res.json({data: row});
        });
    });


    restapi.listen(3000);
    restapi.use(function (req, res, next) {
        res.setTimeout(120000, function () {
            console.log('Request has timed out.');
            res.send(408);
        });

        next();
    });

});

/*
 */

