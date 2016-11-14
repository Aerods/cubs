var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.get = function(data, done) {
    var query = '                                               \
        SELECT b.*                                              \
        FROM badges b                                           \
        LEFT JOIN programme_badges pb ON b.id = pb.badge_id     \
        WHERE pb.programme_id = '+data.programme_id+'           \
        GROUP BY b.id                                           \
    ';
    db.get().query(query, function (err, badges) {

        if (badges.length) {
            return new Promise(function (resolve, reject) {
                badges.map(function(badge, i) {

                    db.get().query('                                                                \
                        SELECT bc.*, IF(pc.id, 1, 0) as selected                                    \
                        FROM badge_criteria bc                                                      \
                        LEFT JOIN programme_badge_criteria pc ON bc.id = pc.badge_criteria_id       \
                        AND pc.programme_id = '+data.programme_id+'                                 \
                        WHERE bc.badge_id = '+badge.id+'                                            \
                        GROUP BY bc.id                                                              \
                    ', function (err, badge_criteria) {
                        return new Promise(function (resolve, reject) {
                            badge_criteria.map(function(criteria, i2) {

                                db.get().query('                                                                \
                                    SELECT bt.*, IF(pt.id, 1, 0) as selected                                    \
                                    FROM badge_tasks bt                                                         \
                                    LEFT JOIN programme_badge_tasks pt ON bt.id = pt.badge_task_id              \
                                    AND pt.programme_id = '+data.programme_id+'                                 \
                                    WHERE bt.badge_criteria_id = '+criteria.id+'                                \
                                    GROUP BY bt.id                                                              \
                                ', function (err, badge_tasks) {
                                    badge_criteria[i2].badge_tasks = badge_tasks;
                                    badge.badge_criteria = badge_criteria;
                                    if (i2+1 == badge_criteria.length) resolve(badge);
                                })
                            })
                        }).then(function(badge) {
                            badges[i] = badge;
                            if (i+1 == badges.length) resolve(badges);
                        })
                    })
                })
            }).then(function(badges) {
                done(null, badges);
            })
        } else {
            done(null, []);
        }
    })
}
