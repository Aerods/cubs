var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.create = function(data, done) {
    return new Promise(function (resolve, reject) {
        var ids = data.badge_criteria.map(function(criteria) {
            return new Promise(function (resolve, reject) {
                criteria.badge_tasks.map(function(task) {
                    if (task.selected) {
                        completeTask(task.id, data.cubs, function(cub_task_id) {
                            return cub_task_id;
                        });
                    } else if (data.deleteUnselected) {
                        uncompleteTask(task.id, data.cubs[0].id);
                    }
                });
                resolve();
            }).then(function() {
                if (criteria.selected) {
                    completeCriteria(criteria.id, data.cubs, function(cub_criteria_id) {
                        return cub_criteria_id;
                    });
                } else if (data.deleteUnselected) {
                    uncompleteCriteria(criteria.id, data.cubs[0].id);
                }
            });
        });
        resolve(ids);
    }).then(function(ids) {
        server.emitSocket('activityUpdate');
        done(null, ids);
    })
}

exports.update = function(data, done) {
    if (data.mark) {
        data.cub.selected = 1;
        completeTask(data.task_id, [data.cub], done);
    } else {
        uncompleteTask(data.task_id, data.cub.id, done);
    }
}

function completeTask(task_id, cubs, done) {
    return new Promise(function (resolve, reject) {
        var ids = cubs.map(function(cub) {
            if (cub.selected) {
                var values = [
                    cub.id,
                    task_id
                ];
                db.get().query('                        \
                    INSERT INTO cub_badge_tasks (       \
                        cub_id,                         \
                        badge_task_id                   \
                    )                                   \
                    VALUES(?, ?)                        \
                ', values, function(err, result) {
                    return (result ? result.insertId : err);
                });
            }
        });
        resolve(ids);
    }).then(function(ids) {
        done(null, ids);
    });
}

function uncompleteTask(task_id, cub_id, done) {
    var values = [cub_id, task_id];
    db.get().query('                        \
        DELETE FROM cub_badge_tasks         \
        WHERE cub_id = ? AND badge_task_id = ?    \
    ', values, function(err, result) {
        done(null, result);
    });
}

function uncompleteCriteria(criteria_id, cub_id) {
    var values = [cub_id, criteria_id];
    db.get().query('                        \
        DELETE FROM cub_badge_criteria         \
        WHERE cub_id = ? AND badge_criteria_id = ?    \
    ', values, function(err, result) {
        return result;
    });
}

function completeCriteria(criteria_id, cubs, done) {
    return new Promise(function (resolve, reject) {
        var ids = cubs.map(function(cub) {
            if (cub.selected) {
                var values = [
                    cub.id,
                    criteria_id
                ];
                db.get().query('                        \
                    INSERT INTO cub_badge_criteria (    \
                        cub_id,                         \
                        badge_criteria_id               \
                    )                                   \
                    VALUES(?, ?)                        \
                ', values, function(err, result) {
                    server.emitSocket('activityUpdate');
                    if (!err) return result.insertId;
                });
            }
        });
        resolve(ids);
    }).then(function(ids) {
        done(ids);
    });
}
