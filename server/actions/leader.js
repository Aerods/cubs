var db = require('../../db.js')
var server = require('../server.js')
var action_log = require("./action_log.js");
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.create = function(data, done) {
    // Validate data
    var err = {};
    var values = [
        data.title,
        data.forename,
        data.surname,
        data.position,
        data.cub_name,
        data.username,
        data.phone_1,
        data.phone_2,
        data.email,
        data.address_1,
        data.address_2,
        data.address_3,
        data.town,
        data.postcode,
        data.section,
        data.group
    ];
    action_log.create('leaders', 'insert', data, function() {
        db.get().query('                        \
            INSERT INTO leaders (               \
                title,                          \
                forename,                       \
                surname,                        \
                position,                       \
                cub_name,                       \
                username,                       \
                phone_1,                        \
                phone_2,                        \
                email,                          \
                address_1,                      \
                address_2,                      \
                address_3,                      \
                town,                           \
                postcode,                        \
                section,                        \
                `group`                        \
            )                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
        ', values, function(err, result) {
            if (err) return done(err);
            server.emitSocket('leadersUpdate');
            done(null, { id: result.insertId });
        })
    })
}

exports.update = function(data, done) {
    var values = [
        data.title,
        data.forename,
        data.surname,
        data.position,
        data.cub_name,
        data.username,
        data.password,
        data.phone_1,
        data.phone_2,
        data.email,
        data.address_1,
        data.address_2,
        data.address_2,
        data.town,
        data.postcode,
        data.id
    ];
    if (!data.password) values.splice(6, 1);
    action_log.create('leaders', 'update', data, function() {
        db.get().query('                \
            update leaders set          \
                title = ?,              \
                forename = ?,           \
                surname = ?,            \
                position = ?,           \
                cub_name = ?,           \
                username = ?,           \
                '+(data.password ? 'password = SHA1(?),' : '')+'\
                phone_1 = ?,            \
                phone_2 = ?,            \
                email = ?,              \
                address_1 = ?,          \
                address_2 = ?,          \
                address_3 = ?,          \
                town = ?,               \
                postcode = ?            \
            where id = ?                \
        ', values, function(err, result) {
            if (err) return done(err)
            server.emitSocket('leadersUpdate');
            done(null, { id: data.id })
        })
    })
}

exports.delete = function(data, done) {
    action_log.create('leaders', 'delete', data, function() {
        db.get().query('UPDATE leaders SET deleted = 1 WHERE id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('leadersUpdate');
            done(null, { id: result.affectedRows })
        })
    })
}

exports.login = function(data, done) {
    db.get().query('SELECT id, section, `group` FROM leaders WHERE (username = ? or email = ?) AND password = SHA1(?) AND deleted=0 LIMIT 1', [data.username, data.username, data.password], function(err, result) {
        if (err) return done(err);
        else if (result[0]) done(null, { result: 'success', token: 'P3X-595', leader_id: result[0].id, section: result[0].section, group: result[0].group });
        else {
            db.get().query('SELECT id, section, `group` FROM parents WHERE email = ? AND password = SHA1(?) AND deleted=0 LIMIT 1', [data.username, data.password], function(err, result) {
                if (err) return done(err);
                else if (result[0]) done(null, { result: 'success', token: 'P3X-595', parent_id: result[0].id, section: result[0].section, group: result[0].group });
                else {
                    done(null, { result: 'Fail' });
                }
            });
        }
    })
}
