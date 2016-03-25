var express = require('express');
var router = express.Router();
var pg = require('../postgres');
var _ = require('lodash');
var Empresa = require('../models/empresa');

// Create a new object, that prototypally inherits from the Error constructor
function UserNotFoundError(message) {
    this.name = 'UserNotFoundError';
    this.message = message || 'User Not Found';
    this.stack = (new Error()).stack;
    this.status = 404;
}
UserNotFoundError.prototype = Object.create(Error.prototype);
UserNotFoundError.prototype.constructor = UserNotFoundError;

/* GET users listing. */
router.get('/', function (req, res, next) {
    pg.User.findAll().then(function (users) {
        res.json({data: users});
    });
});

router.get('/:user', function (req, res, next) {
    pg.User.findById(req.params.user).then(function (user) {
        if (!user) throw new UserNotFoundError();
        res.json({data: user});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:user/empresas', function (req, res, next) {
    pg.User.findById(req.params.user).then(function (user) {
        if (!user)throw new UserNotFoundError();
        return user.getEmpresa();
    }).then(function (empresas) {
        var include = _.map(empresas, 'empresa');
        return Empresa.list(include);
    }).then(function (result) {
        res.json({data: result});
    }).catch(function (error) {
        next(error);
    });
});

module.exports = router;
