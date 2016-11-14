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
        data.phone_1,
        data.phone_2,
        data.email,
        data.address_1,
        data.address_2,
        data.address_3,
        data.town,
        data.postcode
    ];
    action_log.create('leaders', 'insert', data, function() {
        db.get().query('                        \
            INSERT INTO leaders (               \
                title,                          \
                forename,                       \
                surname,                        \
                position,                       \
                cub_name,                       \
                phone_1,                        \
                phone_2,                        \
                email,                          \
                address_1,                      \
                address_2,                      \
                address_3,                      \
                town,                           \
                postcode                        \
            )                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
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
    action_log.create('leaders', 'update', data, function() {
        db.get().query('                \
            update leaders set          \
                title = ?,              \
                forename = ?,           \
                surname = ?,            \
                position = ?,           \
                cub_name = ?,           \
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
        db.get().query('UPDATE leaders SET deleted = 1 where id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('leadersUpdate');
            done(null, { id: result.affectedRows })
        })
    })
}
