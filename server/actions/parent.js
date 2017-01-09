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
        data.relationship,
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
    action_log.create('parents', 'insert', data, function() {
        db.get().query('                        \
            INSERT INTO parents (               \
                title,                          \
                forename,                       \
                surname,                        \
                relationship,                   \
                phone_1,                        \
                phone_2,                        \
                email,                          \
                address_1,                      \
                address_2,                      \
                address_3,                      \
                town,                           \
                postcode,                       \
                section,                        \
                `group`                         \
            )                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
        ', values, function(err, result) {
            if (err) return done(err);
            server.emitSocket('parentsUpdate');
            done(null, { id: result.insertId });
        })
    })
}

exports.update = function(data, done) {
    var values = [
        data.title,
        data.forename,
        data.surname,
        data.relationship,
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
    action_log.create('parents', 'update', data, function() {
        db.get().query('                \
            update parents set          \
                title = ?,              \
                forename = ?,           \
                surname = ?,            \
                relationship = ?,       \
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
            server.emitSocket('parentsUpdate');
            done(null, { id: data.id })
        })
    })
}

exports.delete = function(data, done) {
    action_log.create('parents', 'delete', data, function() {
        db.get().query('UPDATE parents SET deleted = 1 where id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('parentsUpdate');
            done(null, { id: result.affectedRows })
        })
    })
}
