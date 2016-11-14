var db = require('../../db.js')
var server = require('../server.js')
var taskActions = require("./task.js");

exports.save = function(data, done) {
    if (!data.id) {
        if (data.complete_all) data.complete_x = null;
        var values = [
            data.badge_id,
            data.text,
            data.complete_all,
            data.complete_x || null
        ];
        db.get().query('                    \
            INSERT INTO badge_criteria (    \
                badge_id,                   \
                text,                       \
                complete_all,               \
                complete_x                  \
            )                               \
            VALUES(?, ?, ?, ?)              \
        ', values, function(err, result) {
            if (err) return done(err);
            saveTasks(data.badge_tasks, result.insertId, function(err) {
                if (err) return done(err);
                done(null, { id: result.insertId });
            })
        })
    } else if (!data.deleted) {
        if (data.complete_all) data.complete_x = null;
        var values = [
            data.text,
            data.complete_all,
            data.complete_x || null,
            data.id
        ];
        db.get().query('                \
            UPDATE badge_criteria SET   \
                text = ?,               \
                complete_all = ?,       \
                complete_x = ?          \
            WHERE id = ?                \
        ', values, function(err, result) {
            if (err) return done(err)
            saveTasks(data.badge_tasks, data.id, function(err) {
                if (err) return done(err);
                done(null, { id: data.id });
            })
        })
    } else {
        deleteCriteria(data.id, function(id) { done(null, id); });
    }
}

function saveTasks(data, badge_criteria_id, done) {
    var promise = require("es6-promise");
    var Promise = promise.Promise;
    return new Promise(function (resolve, reject) {
        data.map(function(task, key) {
            if (task.id || !task.deleted) {
                task.badge_criteria_id = badge_criteria_id;
                taskActions.save(task, function(){});
            }
        })
    }).then(function() {
        done(null, badge_criteria_id);
    })
}

function deleteCriteria(id, done) {
    db.get().query('DELETE FROM badge_criteria WHERE id = ?', id, function(err, result) {
        if (err) return done(err);
        done(null, id);
    })
}
