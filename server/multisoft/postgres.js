var _ = require('lodash');
var Sequelize = require('sequelize');
var config = require('config'), pg = config.get('postgres');

var sequelize = new Sequelize(pg.database, pg.user, pg.password, {
    host: pg.host,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var models = {};

models.User = sequelize.define('user', {
    password: {
        type: Sequelize.STRING(128)
    },
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING(254)
    },
    isSuperuser: {
        type: Sequelize.BOOLEAN,
        field: 'is_superuser'
    },
    isStaff: {
        type: Sequelize.BOOLEAN,
        field: 'is_staff'
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        field: 'is_active'
    }
}, {
    defaultScope: {
        where: {
            isActive: true
        },
        attributes: {exclude: ['password', 'isStaff', 'isActive', 'isSuperuser']}
    },
    timestamps: false,
    underscored: true,
    tableName: 'auth_user'
});

models.UsuarioEmpresa = sequelize.define('userEmpresa', {
    empresa: {
        type: Sequelize.STRING(30)
    }
}, {
    timestamps: false,
    underscored: true,
    tableName: 'custom_permissions_usuarioempresa'
});

models.User.hasMany(models.UsuarioEmpresa, {as: 'empresa'});

module.exports = models;