var Promise = require('bluebird');
var sqlanywhere = Promise.promisifyAll(require('sqlanywhere'));
var config = require('config');

var dbConfig = config.get('sybase.dbConfig');

var client = sqlanywhere.createConnection();

client.connect(dbConfig, function (err) {
    if (err) throw err;
    console.log('Conectado a:', dbConfig);
});

client.discon = function () {
    client.disconnect(function (err) {
        if (err) throw err;
        console.log('Desconectado cliente');
    });
};

module.exports = Promise.promisifyAll(client);
