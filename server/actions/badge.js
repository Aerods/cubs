var db = require('../../db.js')
var server = require('../server.js')
var criteriaActions = require("./criteria.js");
var action_log = require("./action_log.js");
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.create = function(data, done) {
    var values = [
        data.name,
        data.type,
        data.stage || null,
        data.image
    ];
    action_log.create('badges', 'insert', data, function() {
        db.get().query('                        \
            INSERT INTO badges (                \
                name,                           \
                type,                           \
                stage,                          \
                image                           \
            )                                   \
            VALUES(?, ?, ?, ?)                  \
        ', values, function(err, result) {
            if (err) return done(err);
            server.emitSocket('badgesUpdate');
            if (!data.badge_criteria.length) done(null, { id: result.insertId });
            saveCriteria(data.badge_criteria, result.insertId, function(err) {
                if (err) return done(err);
                done(null, { id: result.insertId });
            })
        })
    })
}

exports.update = function(data, done) {
    var values = [
        data.name,
        data.type,
        data.stage || null,
        data.image,
        data.id
    ];
    action_log.create('badges', 'update', data, function() {
        db.get().query('                \
            update badges set           \
                name = ?,               \
                type = ?,               \
                stage = ?,              \
                image = ?               \
            where id = ?                \
        ', values, function(err, result) {
            if (err) return done(err)
            server.emitSocket('badgesUpdate');
            saveCriteria(data.badge_criteria, data.id, function(err) {
                if (err) return done(err);
                done(null, { id: result.insertId });
            })
            done(null, { id: data.id })
        })
    })
}

function saveCriteria(data, badge_id, done) {
    return new Promise(function (resolve, reject) {
        data.map(function(criteria, key) {
            if (criteria.id || !criteria.deleted) {
                criteria.badge_id = badge_id;
                criteriaActions.save(criteria, function(){});
            }
        })
    }).then(function() {
        done(null, badge_id);
    })
}

exports.delete = function(data, done) {
    action_log.create('badges', 'delete', data, function() {
        db.get().query('UPDATE badges SET deleted = 1 where id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('badgesUpdate');
            done(null, { id: result.affectedRows })
        })
    })
}
