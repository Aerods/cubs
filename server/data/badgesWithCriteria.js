var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;
var _ = require('underscore');

exports.get = function(data, done) {
    var where = 'WHERE b.deleted = 0';
    if (data.id) { where += (' and b.id =' + data.id); }
    if (data.purpose == 'progress') where += ' and b.type != "core"';

    var query = '                                                       \
        SELECT                                                          \
            b.id as badge_id,                                           \
            b.name,                                                     \
            b.type,                                                     \
            b.stage,                                                    \
            b.image,                                                    \
            b.ordering,                                                 \
            bc.id as badge_criteria_id,                                 \
            bc.text,                                                    \
            bc.complete_all,                                            \
            bc.complete_x,                                              \
            bt.id as badge_task_id,                                     \
            bt.task                                                     \
        FROM badges b                                                   \
        LEFT JOIN badge_criteria bc ON b.id=bc.badge_id                 \
        LEFT JOIN badge_tasks bt ON bc.id=bt.badge_criteria_id          \
        ' + where + '                                                   \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        return new Promise(function (resolve, reject) {
            if (rows.length) {
                var badges = {};
                rows.map(function(row, i) {

                    var badge_id = row.badge_id;
                    var badge_criteria_id = row.badge_criteria_id;
                    var badge_task_id = row.badge_task_id;

                    if (!badges[badge_id]) {
                        badges[badge_id] = {
                            id: row.badge_id,
                            name: row.name,
                            type: row.type,
                            stage: row.stage,
                            image: row.image,
                            ordering: row.ordering,
                            badge_criteria: {}
                        };
                    }

                    if (badge_criteria_id && _.isEmpty(badges[badge_id].badge_criteria[badge_criteria_id])) {
                        badges[badge_id].badge_criteria[badge_criteria_id] = {
                            id: badge_criteria_id,
                            badge_id: badge_id,
                            text: row.text,
                            complete_all: row.complete_all,
                            complete_x: row.complete_x,
                            badge_tasks: {},
                            selected: 0
                        };
                    }

                    if (badge_task_id && _.isEmpty(badges[badge_id].badge_criteria[badge_criteria_id].badge_tasks[badge_task_id])) {
                        badges[badge_id].badge_criteria[badge_criteria_id].badge_tasks[badge_task_id] = {
                            id: row.badge_task_id,
                            task: row.task,
                            badge_criteria_id: badge_criteria_id,
                            selected: 0
                        };
                    }

                    if (i+1 == rows.length) {
                        resolve(badges);
                    }
                })
            } else {
                resolve([]);
            }
        }).then(function(badges) {
            var badgesAsArray = [];
            Object.keys(badges).forEach(function(badge_id) {
                var badge_criteria = [];
                Object.keys(badges[badge_id].badge_criteria).forEach(function(criteria_id) {
                    var badge_tasks = [];
                    Object.keys(badges[badge_id].badge_criteria[criteria_id].badge_tasks).forEach(function(task_id) {
                        badge_tasks.push(badges[badge_id].badge_criteria[criteria_id].badge_tasks[task_id]);
                    });
                    var criteria = badges[badge_id].badge_criteria[criteria_id];
                    criteria.badge_tasks = badge_tasks;
                    badge_criteria.push(criteria);
                });
                var badge = badges[badge_id];
                badge.badge_criteria = badge_criteria;
                badgesAsArray.push(badge);
            });
            done(null, badgesAsArray);
        })
    })
}
