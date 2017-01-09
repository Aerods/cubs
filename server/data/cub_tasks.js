var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.get = function(data, done) {
    var where = 'WHERE deleted = 0';
    var values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }

    var query = '                   \
        SELECT                      \
            id,                     \
            forename,               \
            surname                \
        FROM cubs                   \
    ' + where + ' ORDER BY date_of_birth';
    db.get().query(query, values, function (err, cubs) {
        return new Promise(function (resolve1, reject) {
            cubs.map(function(cub, i) {
                cubs[i].badge_tasks = {};
                db.get().query('SELECT badge_task_id from cub_badge_tasks where cub_id = ' + cub.id, function (err, badge_tasks) {
                    return new Promise(function (resolve2, reject) {
                        var cub_tasks = {};
                        if (badge_tasks.length) {
                            badge_tasks.map(function(task, i2) {
                                cub_tasks[task.badge_task_id] = 1;
                                if (i2+1 == badge_tasks.length) resolve2(cub_tasks);
                            })
                        } else {
                            resolve2(cub_tasks);
                        }
                    }).then(function(cub_tasks) {
                        cubs[i].badge_tasks = cub_tasks;
                        if (i+1 == cubs.length) resolve1(cubs);
                    })
                })
            })
        }).then(function(cubs) {
            done(null, cubs);
        })
    })
}
