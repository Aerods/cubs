var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.get = function(data, done) {
    var where = "WHERE b.id = ?";
    var values = [data.cub_id, data.cub_id, data.badge_id];

    var query = '                                                       \
        SELECT                                                          \
            SUM(IF(cbt.id, 1, 0)) AS completed,                         \
            IFNULL(bc.complete_x, COUNT(bt.id)) AS to_complete          \
        FROM badges b                                                   \
        LEFT JOIN badge_criteria bc ON b.id=bc.badge_id                 \
        LEFT JOIN badge_tasks bt ON bc.id=bt.badge_criteria_id          \
        LEFT JOIN cub_badge_criteria cbc ON bc.id=cbc.badge_criteria_id \
            AND cbc.cub_id = ?                                          \
        LEFT JOIN cub_badge_tasks cbt ON bt.id=cbt.badge_task_id        \
            AND cbt.cub_id = ?                                          \
        '+ where +'                                                     \
        GROUP BY bc.id                                                  \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        var completed = 0;
        var to_complete = 0;
        return new Promise(function (resolve, reject) {
            if (rows.length) {
                var percentages = 0;
                rows.map(function(row, i) {
                    var criteriaPercentage = (row.completed / row.to_complete) * 100;
                    if (criteriaPercentage > 100) criteriaPercentage = 100;
                    percentages += criteriaPercentage;
                    if (i+1 == rows.length) {
                        var percentage = percentages / rows.length;
                        percentage = Math.round(percentage);
                        if (!percentage) percentage = 0;
                        resolve(percentage);
                    }
                })
            } else {
                resolve(0);
            }
        }).then(function(progress) {
            done(null, { badge_id: data.badge_id, progress: progress });
        })
    })
}
