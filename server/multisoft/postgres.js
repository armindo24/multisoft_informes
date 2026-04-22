var config = require('config');
var Pg = require('pg');

var pgCfg = config.get('postgres') || {};

var pool = new Pg.Pool({
    host: pgCfg.host || 'localhost',
    port: pgCfg.port || 5432,
    database: pgCfg.database,
    user: pgCfg.user,
    password: pgCfg.password,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
});

function q(sql, params) {
    return pool.query(sql, params || []).then(function (res) {
        return res.rows || [];
    });
}

function attachGetEmpresa(userRow) {
    if (!userRow) return null;
    userRow.getEmpresa = function () {
        return q(
            "SELECT empresa, db FROM custom_permissions_usuarioempresa WHERE user_id = $1",
            [userRow.id]
        );
    };
    return userRow;
}

var models = {};

models.User = {
    findAll: function () {
        var sql =
            "SELECT id, username, email, first_name AS \"firstName\", last_name AS \"lastName\", " +
            "is_superuser AS \"isSuperuser\", is_staff AS \"isStaff\", is_active AS \"isActive\" " +
            "FROM auth_user WHERE is_active = TRUE ORDER BY username";
        return q(sql).then(function (rows) {
            return rows.map(attachGetEmpresa);
        });
    },
    findById: function (id) {
        var sql =
            "SELECT id, username, email, first_name AS \"firstName\", last_name AS \"lastName\", " +
            "is_superuser AS \"isSuperuser\", is_staff AS \"isStaff\", is_active AS \"isActive\" " +
            "FROM auth_user WHERE id = $1 LIMIT 1";
        return q(sql, [id]).then(function (rows) {
            if (!rows.length) return null;
            return attachGetEmpresa(rows[0]);
        });
    }
};

models.UsuarioEmpresa = {
    findAllByUser: function (userId) {
        return q(
            "SELECT empresa, db FROM custom_permissions_usuarioempresa WHERE user_id = $1",
            [userId]
        );
    }
};

module.exports = models;

