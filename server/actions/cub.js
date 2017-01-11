var db = require('../../db.js')
var server = require('../server.js')
var parentActions = require("./parent.js");
var cubBadgeActions = require("./cubBadge.js");
var action_log = require("./action_log.js");
var promise = require("es6-promise");
var Promise = promise.Promise;
var moment = require('moment');

exports.create = function(data, done) {
    var date_of_birth = moment(data.date_of_birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var start_date = moment(data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var from_beavers = moment(data.from_beavers, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var invested = moment(data.invested, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var to_scouts = moment(data.to_scouts, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var values = [
        data.forename,
        data.surname,
        (date_of_birth == 'Invalid date' ? null : date_of_birth),
        data.gender,
        (data.rank == 'None' ? null : data.rank),
        data.six,
        data.phone,
        data.address_1,
        data.address_2,
        data.address_3,
        data.town,
        data.postcode,
        (start_date == 'Invalid date' ? null : start_date),
        (from_beavers == 'Invalid date' ? null : from_beavers),
        (invested == 'Invalid date' ? null : invested),
        data.previous_group,
        data.medical_information,
        data.notes,
        (to_scouts == 'Invalid date' ? null : to_scouts),
        data.section,
        data.group
    ];
    action_log.create('cubs', 'insert', data, function() {
        db.get().query('                                        \
            INSERT INTO cubs (                                  \
                forename,                                       \
                surname,                                        \
                date_of_birth,                                  \
                gender,                                         \
                rank,                                           \
                six,                                            \
                phone,                                          \
                address_1,                                      \
                address_2,                                      \
                address_3,                                      \
                town,                                           \
                postcode,                                       \
                start_date,                                     \
                from_beavers,                                   \
                invested,                                       \
                previous_group,                                 \
                medical_information,                            \
                notes,                                          \
                to_scouts,                                      \
                section,                                        \
                `group`                                         \
            )                                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \
        ', values, function(err, result) {
            if (err) return done(err)
            server.emitSocket('cubsUpdate');
            saveParents(data.parents, data.group, result.insertId, function(err) {
                cubBadgeActions.save(data.cub_badges, result.insertId, function(err) {
                    if (err) return done(err);
                    done(null, { id: result.insertId });
                })
            })
        })
    })
}

exports.update = function(data, done) {
    var date_of_birth = moment(data.date_of_birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var start_date = moment(data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var from_beavers = moment(data.from_beavers, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var invested = moment(data.invested, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var to_scouts = moment(data.to_scouts, 'DD/MM/YYYY').format('YYYY-MM-DD');

    var values = [
        data.forename,
        data.surname,
        (date_of_birth == 'Invalid date' ? null : date_of_birth),
        data.gender,
        (data.rank == 'None' ? null : data.rank),
        data.six,
        data.phone,
        data.address_1,
        data.address_2,
        data.address_3,
        data.town,
        data.postcode,
        (start_date == 'Invalid date' ? null : start_date),
        (from_beavers == 'Invalid date' ? null : from_beavers),
        (invested == 'Invalid date' ? null : invested),
        data.previous_group,
        data.medical_information,
        data.notes,
        (to_scouts == 'Invalid date' ? null : to_scouts),
        data.id
    ];
    action_log.create('cubs', 'update', data, function() {
        db.get().query('                \
            update cubs set             \
                forename = ?,           \
                surname = ?,            \
                date_of_birth = ?,      \
                gender = ?,             \
                rank = ?,               \
                six = ?,                \
                phone = ?,              \
                address_1 = ?,          \
                address_2 = ?,          \
                address_3 = ?,          \
                town = ?,               \
                postcode = ?,           \
                start_date = ?,         \
                from_beavers = ?,       \
                invested = ?,           \
                previous_group = ?,     \
                medical_information = ?,\
                notes = ?,              \
                to_scouts = ?           \
            where id = ?                \
        ', values, function(err, result) {
            if (err) return done(err);
            server.emitSocket('cubsUpdate');
            saveParents(data.parents, data.group, data.id, function(err) {
                cubBadgeActions.save(data.cub_badges, data.id, function(err) {
                    if (err) return done(err);
                    done(null, { id: data.id });
                })
            })
        })
    })
}

function saveParents(data, group, cub_id, done) {
    var promise = require("es6-promise");
    var Promise = promise.Promise;
    return new Promise(function (resolve, reject) {
        data.map(function(parent, key) {
            parent.group = group;
            if (parent.id) {
                parentActions.update(parent, function(err, updatedParent) {
                    if (!parent.cub_id) {
                        addCubParent(cub_id, parent.id, function(err, id) {
                            updateParentSection(parent.id);
                        });
                    }
                });
            } else {
                parentActions.create(parent, function(err, parent) {
                    addCubParent(cub_id, parent.id, function(err, id) {
                        updateParentSection(parent.id);
                    });
                });
            }
        })
        resolve();
    }).then(function() {
        done(null, cub_id);
    })
}

function addCubParent(cub_id, parent_id, done) {
    db.get().query('            \
        INSERT INTO cub_parents \
        (cub_id, parent_id)     \
        VALUES(?, ?)            \
    ', [cub_id, parent_id], function(err, result) {
        if (err) return done(err)
        done(null, result.insertId)
    })
}

function updateParentSection(parent_id) {
    db.get().query('        \
        SELECT GROUP_CONCAT(DISTINCT(c.section)) as section \
        FROM parents p      \
        LEFT JOIN cub_parents cp ON p.id=cp.parent_id   \
        LEFT JOIN cubs c ON c.id=cp.cub_id              \
        WHERE p.id = ?      \
    ', [parent_id], function (err, rows) {
        db.get().query('            \
            UPDATE parents          \
            SET section = ?         \
            WHERE id = ?            \
        ', [rows[0].section, parent_id]);
    })
}

exports.delete = function(data, done) {
    action_log.create('cubs', 'delete', data, function() {
        db.get().query('UPDATE cubs SET deleted = 1 WHERE id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('cubsUpdate');
            done(null, result.affectedRows)
        })
    })
}
