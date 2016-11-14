var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.get = function(data, done) {
    var where = 1;
    if (data.cub_id) { where += (' and cub_id =' + data.cub_id); }

    var query = '                                                       \
        SELECT                                                          \
            SUM(IF(cbt.id, 1, 0)) AS completed,                         \
            IFNULL(bc.complete_x, COUNT(bt.id)) AS to_complete          \
        FROM badges b                                                   \
        LEFT JOIN badge_criteria bc ON b.id=bc.badge_id                 \
        LEFT JOIN badge_tasks bt ON bc.id=bt.badge_criteria_id          \
        LEFT JOIN cub_badge_criteria cbc ON bc.id=cbc.badge_criteria_id \
            AND cbc.cub_id='+data.cub_id+'                              \
        LEFT JOIN cub_badge_tasks cbt ON bt.id=cbt.badge_task_id        \
            AND cbt.cub_id='+data.cub_id+'                              \
        WHERE b.id='+data.badge_id+'                                    \
        GROUP BY bc.id                                                  \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        var completed = 0;
        var to_complete = 0;
        return new Promise(function (resolve, reject) {
            if (rows.length) {
                rows.map(function(row, i) {
                    completed += row.completed;
                    to_complete += row.to_complete;
                    if (i+1 == rows.length) {
                        var percentage = (completed / to_complete) * 100;
                        percentage = Math.round(percentage);
                        resolve(percentage);
                    }
                })
            } else {
                resolve(0);
            }
        }).then(function(progress) {
            done(null, progress);
        })
    })
}
