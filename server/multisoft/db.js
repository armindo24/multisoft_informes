var sqlanywhere = require('sqlanywhere');
var config = require('config');

var dbConfig = config.get('sybase.dbConfig');

var client = sqlanywhere.createConnection();

client.connect(dbConfig, function (err) {
    //if (err) throw err;
    console.log(err);
    console.log('Conectado a:', dbConfig);
});

client.discon = function () {
    client.disconnect(function (err) {
        if (err) throw err;
        console.log('Desconectado cliente');
    });
};

client.test = function () {
    console.log("Hola Mundo!");
    return 'hola-mundo';
};

module.exports = client;