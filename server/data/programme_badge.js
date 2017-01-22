var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;
var _ = require('underscore');

exports.get = function(data, done) {
    var values = [data.programme_id, data.programme_id, data.programme_id];
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
            bc.ordering as criteria_ordering,                           \
            IF(pc.id, 1, 0) as criteria_selected,                       \
            bt.id as badge_task_id,                                     \
            bt.task,                                                    \
            bt.ordering as task_ordering,                               \
            IF(pt.id, 1, 0) as task_selected                            \
        FROM badges b                                                   \
        LEFT JOIN badge_criteria bc ON b.id=bc.badge_id                 \
        LEFT JOIN badge_tasks bt ON bc.id=bt.badge_criteria_id          \
        LEFT JOIN programme_badges pb ON b.id = pb.badge_id             \
        LEFT JOIN programme_badge_criteria pc ON bc.id = pc.badge_criteria_id       \
            AND pc.programme_id = ?                                     \
        LEFT JOIN programme_badge_tasks pt ON bt.id = pt.badge_task_id              \
            AND pt.programme_id = ?                                     \
        WHERE pb.programme_id = ?                                       \
        ORDER BY b.ordering, bc.ordering, bc.id, bt.ordering, bt.id     \
    ';
    db.get().query(query, values, function (err, rows) {
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
                            ordering: row.criteria_ordering,
                            selected: row.criteria_selected
                        };
                    }

                    if (badge_task_id && _.isEmpty(badges[badge_id].badge_criteria[badge_criteria_id].badge_tasks[badge_task_id])) {
                        badges[badge_id].badge_criteria[badge_criteria_id].badge_tasks[badge_task_id] = {
                            id: row.badge_task_id,
                            task: row.task,
                            badge_criteria_id: badge_criteria_id,
                            ordering: row.task_ordering,
                            selected: row.task_selected
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
