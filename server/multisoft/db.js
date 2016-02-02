var sqlanywhere = require('sqlanywhere');
var settings = require('./config/local');
var client = sqlanywhere.createConnection();

client.connect(settings.cstr, function (err) {
    //if (err) throw err;
    console.log(err);
    console.log('Conectado a:', settings.cstr.Server);
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