var db = require('../../db.js')
var server = require('../server.js')
var action_log = require("./action_log.js");
var moment = require('moment');
var activityActions = require("./activity.js");

exports.create = function(data, done) {
    // Validate data
    var err = {};
    var date = moment(data.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var end_date = moment(data.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var values = [
        (date == 'Invalid date' ? null : date),
        data.title,
        data.type,
        data.location,
        data.details,
        data.start_time,
        data.end_time,
        (end_date == 'Invalid date' ? null : end_date),
        data.section,
        data.group
    ];
    action_log.create('programme', 'insert', values, function() {
        db.get().query('                        \
            INSERT INTO programme (             \
                date,                           \
                title,                          \
                type,                           \
                location,                       \
                details,                        \
                start_time,                     \
                end_time,                       \
                end_date,                       \
                section,                        \
                `group`                         \
            )                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)      \
        ', values, function(err, result) {
            addBadgeWork(result.insertId, data.badges, data.cubs);
            if (err) return done(err);
            server.emitSocket('programmeUpdate');
            done(null, { id: result.insertId });
        });
    });
}

exports.update = function(data, done) {
    var date = moment(data.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var end_date = moment(data.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var values = [
        (date == 'Invalid date' ? null : date),
        data.title,
        data.type,
        data.location,
        data.details,
        data.start_time,
        data.end_time,
        (end_date == 'Invalid date' ? null : end_date),
        data.id
    ];
    action_log.create('programme', 'update', data, function() {
        db.get().query('                \
            update programme set        \
                date = ?,               \
                title = ?,              \
                type = ?,               \
                location = ?,           \
                details = ?,            \
                start_time = ?,         \
                end_time = ?,           \
                end_date = ?            \
            where id = ?                \
        ', values, function(err, result) {
            if (err) return done(err);
            addBadgeWork(data.id, data.badges, data.cubs);
            server.emitSocket('programmeUpdate');
            done(null, { id: data.id })
        });
    });
}

function addBadgeWork(programme_id, badges, cubs) {
    removeOldBadgeWork(programme_id, function() {
        cubs.map(function(cub) {
            if (cub.selected) {
                addCub(programme_id, cub.id);
            }
        });
        badges.map(function(badge, i) {
            addBadge(programme_id, badge.id);
            activityActions.create({ badge_criteria: badge.badge_criteria, cubs: cubs }, function() {});
            badge.badge_criteria.map(function(criteria, i) {
                if (criteria.selected) {
                    addCriteria(programme_id, criteria.id);
                }
                criteria.badge_tasks.map(function(task) {
                    if (task.selected) {
                        addTask(programme_id, task.id);
                    }
                });
            });
        });
    });
}

function addCub(programme_id, cub_id) {
    db.get().query('                        \
        INSERT INTO programme_cubs (        \
            programme_id,                   \
            cub_id                          \
        )                                   \
        VALUES(?, ?)                        \
    ', [programme_id, cub_id]);
}

function addTask(programme_id, task_id) {
    db.get().query('                        \
        INSERT INTO programme_badge_tasks ( \
            programme_id,                   \
            badge_task_id                   \
        )                                   \
        VALUES(?, ?)                        \
    ', [programme_id, task_id]);
}

function addCriteria(programme_id, criteria_id) {
    db.get().query('                            \
        INSERT INTO programme_badge_criteria (  \
            programme_id,                       \
            badge_criteria_id                   \
        )                                       \
        VALUES(?, ?)                            \
    ', [programme_id, criteria_id]);
}

function addBadge(programme_id, badge_id) {
    db.get().query('                        \
        INSERT INTO programme_badges (      \
            programme_id,                   \
            badge_id                        \
        )                                   \
        VALUES(?, ?)                        \
    ', [programme_id, badge_id]);
}

function removeOldBadgeWork(programme_id, done) {
    db.get().query('                                \
        DELETE FROM programme_cubs                  \
        WHERE programme_id = ?                      \
    ', [programme_id], function() {
        db.get().query('                                \
            DELETE FROM programme_badges                \
            WHERE programme_id = ?                      \
        ', [programme_id], function() {
            db.get().query('                            \
                DELETE FROM programme_badge_criteria    \
                WHERE programme_id = ?                  \
            ', [programme_id], function() {
                db.get().query('                        \
                    DELETE FROM programme_badge_tasks   \
                    WHERE programme_id = ?              \
                ', [programme_id], function() {
                    done();
                });
            });
        });
    });
}

exports.delete = function(data, done) {
    action_log.create('programme', 'delete', data, function() {
        db.get().query('DELETE FROM programme where id = ?', data.id, function(err, result) {
            if (err) return done(err)
            server.emitSocket('programmeUpdate');
            done(null, { id: result.affectedRows })
        })
    })
}
